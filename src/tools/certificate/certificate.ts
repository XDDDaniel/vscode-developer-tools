import type { ToolResult } from "../../types/index";
import forge from "node-forge";

export const certificateAnalyzeHandler = async (
  input: string,
  _options?: unknown,
): Promise<ToolResult> => {
  try {
    if (!input) {
      return { error: "Certificate input is required", success: false };
    }

    const { pki } = forge;

    let certObj: ReturnType<typeof pki.certificateFromPem>;

    if (input.includes("-----BEGIN CERTIFICATE-----")) {
      certObj = pki.certificateFromPem(input);
    } else {
      try {
        const der = Buffer.from(input, "base64");
        const { asn1 } = forge;
        const asn1Obj = asn1.fromDer(der.toString("binary"));
        certObj = pki.certificateFromAsn1(asn1Obj);
      } catch {
        return {
          error: "Invalid certificate format. Use PEM or DER.",
          success: false,
        };
      }
    }

    const subject = certObj.subject.attributes;
    const issuer = certObj.issuer.attributes;
    const { validity } = certObj;

    const issuerObj = Object.fromEntries(
      issuer.map((attr) => [attr.shortName || "", attr.value || ""]),
    );

    const subjectObj = Object.fromEntries(
      subject.map((attr) => [attr.shortName || "", attr.value || ""]),
    );

    const result = {
      extensions: certObj.extensions.map((ext) => ({
        critical: ext.critical,
        id: ext.id,
        name: ext.name,
      })),
      issuer: issuerObj,
      serialNumber: certObj.serialNumber,
      signatureAlgorithm: certObj.signatureOid,
      subject: subjectObj,
      validity: {
        notAfter: validity.notAfter.toISOString(),
        notBefore: validity.notBefore.toISOString(),
        valid: validity.notBefore <= new Date() && validity.notAfter >= new Date(),
      },
      version: certObj.version,
    };

    return {
      metadata: {
        issuer: issuer.find((i) => i.shortName === "CN")?.value || "N/A",
        serialNumber: certObj.serialNumber,
        subject: subject.find((s) => s.shortName === "CN")?.value || "N/A",
        valid: result.validity.valid,
      },
      output: JSON.stringify(result, undefined, 2),
      success: true,
    };
  } catch (error: unknown) {
    return {
      error: error instanceof Error ? error.message : "Failed to analyze certificate",
      success: false,
    };
  }
};
