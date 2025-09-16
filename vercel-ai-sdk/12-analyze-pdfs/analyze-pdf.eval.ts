import { Levenshtein, NumericDiff } from "autoevals";
import {
  createScorer,
  evalite,
  EvaliteFile,
} from "evalite";
import path from "path";
import { extractDataFromInvoice } from "./main.ts";

evalite("Analyze PDF", {
  data: async () => [
    {
      input: EvaliteFile.fromPath(
        path.join(
          import.meta.dirname,
          "./invoice-1.pdf",
        ),
      ),
      expected: {
        invoiceNumber: "20130304",
        currency: "AUD",
        total: 39.6,
        companyAddress:
          "123 Somewhere St, Melbourne VIC 3000",
        companyName: "Sunny Farm",
        invoiceeAddress:
          "221 Queen St, Melbourne VIC 3000",
      },
    },
    {
      input: EvaliteFile.fromPath(
        path.join(
          import.meta.dirname,
          "./invoice-2.pdf",
        ),
      ),
      expected: {
        currency: "EUR",
        invoiceNumber: "123100401",
        total: 381.12,
        companyAddress:
          "Im Bruch 3, 63897 Miltenberg/Main",
        companyName: "CPB Software",
        invoiceeAddress:
          "Musterkunde AG Mr. John Doe Musterstr. 23 12345 Musterstadt",
      },
    },
  ],
  task: async (input) => {
    return extractDataFromInvoice(input.path);
  },
  scorers: [
    createScorer({
      name: "Invoice Number",
      scorer: async ({ output, expected }) =>
        Levenshtein({
          output: output.invoiceNumber,
          expected: expected!.invoiceNumber,
        }) as any,
    }),
    createScorer({
      name: "Total",
      scorer: async ({ output, expected }) =>
        NumericDiff({
          output: output.total,
          expected: expected!.total,
        }) as any,
    }),
    createScorer({
      name: "Currency",
      scorer: async ({ output, expected }) =>
        Levenshtein({
          output: output.currency,
          expected: expected!.currency,
        }) as any,
    }),
    createScorer({
      name: "Company Address",
      scorer: async ({ output, expected }) =>
        Levenshtein({
          output: output.companyAddress,
          expected: expected!.companyAddress,
        }) as any,
    }),
    createScorer({
      name: "Company Name",
      scorer: async ({ output, expected }) =>
        Levenshtein({
          output: output.companyName,
          expected: expected!.companyName,
        }) as any,
    }),
    createScorer({
      name: "Invoicee Address",
      scorer: async ({ output, expected }) =>
        Levenshtein({
          output: output.invoiceeAddress,
          expected: expected!.invoiceeAddress,
        }) as any,
    }),
  ],
  experimental_customColumns: async (result) => [
    {
      label: "Invoice File",
      value: result.input,
    },
    {
      label: "Expected",
      value: [
        `- **Invoice Number**: ${result.expected!.invoiceNumber}`,
        `- **Currency**: ${result.expected!.currency}`,
        `- **Total**: ${result.expected!.total}`,
        `- **Company Address**: ${result.expected!.companyAddress}`,
        `- **Company Name**: ${result.expected!.companyName}`,
        `- **Invoicee Address**: ${result.expected!.invoiceeAddress}`,
      ].join("\n"),
    },
    {
      label: "Output",
      value: [
        `- **Invoice Number**: ${result.output.invoiceNumber}`,
        `- **Currency**: ${result.output.currency}`,
        `- **Total**: ${result.output.total}`,
        `- **Company Address**: ${result.output.companyAddress}`,
        `- **Company Name**: ${result.output.companyName}`,
        `- **Invoicee Address**: ${result.output.invoiceeAddress}`,
      ].join("\n"),
    },
  ],
});
