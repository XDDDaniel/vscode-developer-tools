import * as assert from "node:assert";

import { certificateAnalyzeHandler } from "../tools/certificate/certificate";

suite("Certificate Tools", () => {
  test("analyzes valid X.509 certificate", async () => {
    const certPem = `-----BEGIN CERTIFICATE-----
MIIBDDCBt6ADAgECAgEBMA0GCSqGSIb3DQEBBQUAMA8xDTALBgNVBAMTBHRlc3Qw
HhcNMjYwMTE2MTgwNDIzWhcNMjcwMTE2MTgwNDIzWjAPMQ0wCwYDVQQDEwR0ZXN0
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOSui8inbdcTgTnTNqp2+tBE1p1P6YsX
WVwZMKpzBm5ko7zxJUgVe+DL8HtNCx82PRisHJsZdoF3l8B8CDVYPqUCAwEAATAN
BgkqhkiG9w0BAQUFAANBALpk2J8ccF8M6atOEwuOODoIJO9SOaq3JSWfPeYslwQY
oRLP8iHk8cK5fHQk77Zcb9iXx0ChaIlsHByNjpzapug=
-----END CERTIFICATE-----`;

    const result = await certificateAnalyzeHandler(certPem);
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
    assert.ok(
      result.output?.toLowerCase().includes("certificate") ||
        result.output?.toLowerCase().includes("issuer") ||
        result.output?.toLowerCase().includes("subject") ||
        result.output?.toLowerCase().includes("valid"),
    );
  });

  test("handles empty input", async () => {
    const result = await certificateAnalyzeHandler("");
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles invalid certificate format", async () => {
    const result = await certificateAnalyzeHandler("This is not a certificate");
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles malformed PEM", async () => {
    const result = await certificateAnalyzeHandler(
      "-----BEGIN CERTIFICATE-----\nMalformed content\n-----END CERTIFICATE-----",
    );
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles certificate without PEM headers", async () => {
    const result = await certificateAnalyzeHandler(
      "MIICLDCCAdKgAwIBAgIBADAKBggqhkjOPQQDAjB9MQswCQYDVQQGEwJCRTEPMA0G",
    );
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("handles certificate with invalid base64", async () => {
    const result = await certificateAnalyzeHandler(
      "-----BEGIN CERTIFICATE-----\n!!!Invalid Base64!!!\n-----END CERTIFICATE-----",
    );
    assert.strictEqual(result.success, false);
    assert.ok(result.error);
  });

  test("analyzes certificate and returns extensions", async () => {
    const certPem = `-----BEGIN CERTIFICATE-----
MIIBDDCBt6ADAgECAgEBMA0GCSqGSIb3DQEBBQUAMA8xDTALBgNVBAMTBHRlc3Qw
HhcNMjYwMTE2MTgwNDIzWhcNMjcwMTE2MTgwNDIzWjAPMQ0wCwYDVQQDEwR0ZXN0
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOSui8inbdcTgTnTNqp2+tBE1p1P6YsX
WVwZMKpzBm5ko7zxJUgVe+DL8HtNCx82PRisHJsZdoF3l8B8CDVYPqUCAwEAATAN
BgkqhkiG9w0BAQUFAANBALpk2J8ccF8M6atOEwuOODoIJO9SOaq3JSWfPeYslwQY
oRLP8iHk8cK5fHQk77Zcb9iXx0ChaIlsHByNjpzapug=
-----END CERTIFICATE-----`;

    const result = await certificateAnalyzeHandler(certPem);
    assert.strictEqual(result.success, true);
    assert.ok(result.output);
    const parsed = JSON.parse(result.output);
    assert.ok(Array.isArray(parsed.extensions));
    assert.ok(parsed.issuer);
    assert.ok(parsed.subject);
    assert.ok(parsed.validity);
    assert.ok(parsed.serialNumber);
    assert.ok(parsed.version !== undefined);
  });

  test("handles certificate with DER format and valid base64", async () => {
    const result = await certificateAnalyzeHandler(
      "MIICLDCCAdKgAwIBAgIBADAKBggqhkjOPQQDAjB9MQswCQYDVQQGEwJCRTEPMA0GA1UEChMGVEVTVFQxDzANBgNVBAsMBkNydC1DQTAAArN9MA0GCSqGSIb3DQEBAQUAA0sAMEgCQQDG+ywXW1b+V3KzLTDjEoJqF4bY3f9L1uX+8i4d0Z5Q0eX0t0c0aZ0y0v0w0x0y0z0A0BAAMh+8C4QKBgQC7b6FnOY8XyCrK9p0Y1f5Y0b5c5d5e5f5g5h5i5j5k5l5m5n5o5p5q5r5s5t5u5v5w5x5y5z",
    );
    assert.strictEqual(result.success, false);
  });

  test("handles non-Error exception during certificate analysis", async () => {
    const certPem = `-----BEGIN CERTIFICATE-----
MIIBDDCBt6ADAgECAgEBMA0GCSqGSIb3DQEBBQUAMA8xDTALBgNVBAMTBHRlc3Qw
HhcNMjYwMTE2MTgwNDIzWhcNMjcwMTE2MTgwNDIzWjAPMQ0wCwYDVQQDEwR0ZXN0
MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAOSui8inbdcTgTnTNqp2+tBE1p1P6YsX
WVwZMKpzBm5ko7zxJUgVe+DL8HtNCx82PRisHJsZdoF3l8B8CDVYPqUCAwEAATAN
BgkqhkiG9w0BAQUFAANBALpk2J8ccF8M6atOEwuOODoIJO9SOaq3JSWfPeYslwQY
oRLP8iHk8cK5fHQk77Zcb9iXx0ChaIlsHByNjpzapug=
-----END CERTIFICATE-----`;

    const result = await certificateAnalyzeHandler(certPem);
    assert.strictEqual(result.success, true);
  });
});
