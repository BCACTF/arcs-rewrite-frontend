import { TOTP } from "otpauth";


new TOTP({
    issuer: "ARCS_",
    label: "ARCS",
    algorithm: "SHA1",
    digits: 8,
    period: 30,
    secret: "NB2W45DFOIZA",
});

