/* eslint-disable @typescript-eslint/no-empty-interface */

import { randomUUID } from 'crypto';
import { Iso } from 'monocle-ts';
import { Newtype, iso } from 'newtype-ts';

import uuidIsValid from 'uuid-validate';

interface Uuid extends Newtype<{ readonly Uuid: unique symbol }, string> {}
interface DeploymentId extends Newtype<{ readonly Deployment: unique symbol }, string> {}
interface ChallId extends Newtype<{ readonly Chall: unique symbol }, string> {}
interface UserId extends Newtype<{ readonly User: unique symbol }, string> {}
interface TeamId extends Newtype<{ readonly Team: unique symbol }, string> {}

export const projectUuidVersion = 4; // Currently locked to 4 because randomUUID version is locked to 4;

const uuidManager = iso<Uuid>();
const deployIdManager = iso<DeploymentId>();
const challIdManager = iso<ChallId>();
const userIdManager = iso<UserId>();
const teamIdManager = iso<TeamId>();

const idValid = (id: string) => uuidIsValid(id, projectUuidVersion);
const newRandom = () => randomUUID();

const wrapRandom = <NT>(manager: Iso<NT, string>) => () => manager.wrap(newRandom());
const wrapFromStr = <NT>(manager: Iso<NT, string>) => (id: string) => idValid(id) ? manager.wrap(id) : undefined;
const wrapToStr = <NT>(manager: Iso<NT, string>) => (id: NT) => manager.unwrap(id);

const newRandomUuid = wrapRandom(uuidManager);

const uuidFromStr = wrapFromStr(uuidManager);
const deployIdFromStr = wrapFromStr(deployIdManager);
const challIdFromStr = wrapFromStr(challIdManager);
const userIdFromStr = wrapFromStr(userIdManager);
const teamIdFromStr = wrapFromStr(teamIdManager);

const uuidToStr = wrapToStr(uuidManager);
const deployIdToStr = wrapToStr(deployIdManager);
const challIdToStr = wrapToStr(challIdManager);
const userIdToStr = wrapToStr(userIdManager);
const teamIdToStr = wrapToStr(teamIdManager);

export type { Uuid, DeploymentId, ChallId, UserId, TeamId };
export { newRandomUuid };
export { uuidFromStr, deployIdFromStr, challIdFromStr, userIdFromStr, teamIdFromStr };
export { uuidToStr, deployIdToStr, challIdToStr, userIdToStr, teamIdToStr };
