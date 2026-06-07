import type { OperationRecord } from "../types";

interface OperationsTableProps {
  records: OperationRecord[];
}

export function OperationsTable({ records }: OperationsTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-ink/10">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-ink/5">
          <tr>
            <th className="p-3">模块</th>
            <th className="p-3">负责人</th>
            <th className="p-3">状态</th>
            <th className="p-3">指标</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr className="border-t border-ink/10" key={record.key}>
              <td className="p-3">{record.name}</td>
              <td className="p-3">{record.owner}</td>
              <td className="p-3">{record.status}</td>
              <td className="p-3">{record.metric}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
