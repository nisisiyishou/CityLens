import InfrastructurePathCard from "../components/InfrastructurePath";

export default function Home() {
  return (
    <main className="p-8 space-y-8 ">
      <h1 className="text-2xl font-bold">测试页：Infrastructure Path</h1>

      {/* 渲染卡片组件 */}
      <InfrastructurePathCard />

      {/* 下面可以继续加其它测试内容 */}
      <div className="text-slate-500">这是一个测试页面，只保留一个默认导出 Home。</div>
    </main>
  );
}
