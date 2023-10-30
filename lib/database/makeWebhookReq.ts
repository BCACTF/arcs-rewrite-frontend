import { getConfig } from "metadata/server";
import { FromSql, Outgoing } from "./types/outgoing.schema";
import { ToSql } from "./types/incoming.schema";

type DataType<Key extends FromSql["__type"]> = (FromSql & { __type: Key })["data"];

const makeWebhookDbRequest = async <RetType extends FromSql["__type"]>(type: RetType, query: ToSql): Promise<DataType<RetType>> => {
    const { webhook: { url: webhookUrl }, frontendAuthToken } = await getConfig();
    const init: RequestInit = {
        method: "POST",
        headers: {
            "authorization": `Bearer ${frontendAuthToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            sql: query,
        }),
    };
    const fetchReturn = await fetch(webhookUrl, init);
    const returnVal = await fetchReturn.text();
    const jsonVal: Outgoing = (() => {
        try {
            return JSON.parse(returnVal);
        } catch (e) {
            throw returnVal;
        }
    })();
    
    const sql = jsonVal.sqll;

    if (!fetchReturn.ok) throw sql;
    if (!sql) throw jsonVal;
    if ("Err" in sql) {
        throw sql.Err;
    }

    const fromSql = sql.Ok;

    if (type === fromSql.__type) return fromSql.data as DataType<RetType>;
    else throw fromSql
};

export default makeWebhookDbRequest;
