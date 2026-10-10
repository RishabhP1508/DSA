import type { ComparisonExperiment } from "../core/types";

/** Use equivalent generated inputs and print the result with its explicit counter. */
export function comparisonProgram(exp: ComparisonExperiment, code: string, size: number): string {
  return (
    `_ops = [0]\n` +
    `def __op():\n    _ops[0] += 1\n` +
    exp.inputGenerator +
    `\n` +
    code +
    `\n_args = gen(${size})\n_res = solve(*_args)\n` +
    `print(repr(_res) + "|" + str(_ops[0]))\n`
  );
}
