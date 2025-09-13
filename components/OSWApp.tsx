'use client';
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const DIMS: Record<string, { label: string; desc: string; color: string }> = {
  Drive: { label: "推进执行", desc: "计划性、交付力、流程与细节把控", color: "#2563eb" },
  Influence: { label: "影响表达", desc: "表达、说服、公开沟通与受众适配", color: "#16a34a" },
  Cooperation: { label: "关系协作", desc: "共情、协同、冲突缓解与反馈", color: "#f59e0b" },
  Exploration: { label: "创新探索", desc: "好奇、试验、跨域组合与复盘迭代", color: "#7c3aed" },
  Resilience: { label: "情绪韧性", desc: "压力管理、复原、稳定与理性决策", color: "#ef4444" },
};

const ITEMS: { id: number; text: string; dim: keyof typeof DIMS; reverse: boolean }[] = [
  { id: 1, text: "我会把待办拆成步骤并按优先级推进。", dim: "Drive", reverse: false },
  { id: 2, text: "面对枯燥但重要的任务，我能持续跟进直到完成。", dim: "Drive", reverse: false },
  { id: 3, text: "我对‘按时交付’有近乎固执的坚持。", dim: "Drive", reverse: false },
  { id: 4, text: "我会为突发情况准备备选方案。", dim: "Drive", reverse: false },
  { id: 5, text: "我常常临时起意改变计划", dim: "Drive", reverse: true },
  { id: 6, text: "我容易在多个任务间来回切换而不收尾", dim: "Drive", reverse: true },
  { id: 7, text: "我经常复盘并优化自己的工作流程。", dim: "Drive", reverse: false },
  { id: 8, text: "我对细节的容错率很低。", dim: "Drive", reverse: false },

  { id: 9, text: "我能把复杂问题讲得通俗易懂。", dim: "Influence", reverse: false },
  { id: 10, text: "在开会时，我敢于提出不同意见。", dim: "Influence", reverse: false },
  { id: 11, text: "我乐于在公开场合表达与展示。", dim: "Influence", reverse: false },
  { id: 12, text: "我擅长说服他人接受一个方案。", dim: "Influence", reverse: false },
  { id: 13, text: "我更愿意把功劳让给别人而少发声", dim: "Influence", reverse: true },
  { id: 14, text: "我在人群中通常保持安静不多说", dim: "Influence", reverse: true },
  { id: 15, text: "我会根据听众调整表达风格。", dim: "Influence", reverse: false },
  { id: 16, text: "我与陌生人沟通时几乎不感到紧张。", dim: "Influence", reverse: false },

  { id: 17, text: "我愿意在同事需要时临时顶上。", dim: "Cooperation", reverse: false },
  { id: 18, text: "我能觉察到他人的情绪变化。", dim: "Cooperation", reverse: false },
  { id: 19, text: "我在团队里更关注‘我们’而不是‘我’。", dim: "Cooperation", reverse: false },
  { id: 20, text: "我愿意主动给予正向反馈与赞赏。", dim: "Cooperation", reverse: false },
  { id: 21, text: "我容易因为小分歧而心生芥蒂", dim: "Cooperation", reverse: true },
  { id: 22, text: "当他人不配合时，我会立刻强硬对抗", dim: "Cooperation", reverse: true },
  { id: 23, text: "我会努力让不同意见找到折中点。", dim: "Cooperation", reverse: false },
  { id: 24, text: "我愿意倾听与对方立场相反的理由。", dim: "Cooperation", reverse: false },

  { id: 25, text: "我会主动尝试新工具/新方法提升效率。", dim: "Exploration", reverse: false },
  { id: 26, text: "我对未知领域充满好奇心。", dim: "Exploration", reverse: false },
  { id: 27, text: "我会提出‘还有没有更好的做法’的问题。", dim: "Exploration", reverse: false },
  { id: 28, text: "我喜欢把来自不同领域的点子进行组合。", dim: "Exploration", reverse: false },
  { id: 29, text: "我更偏好按旧经验做事不折腾", dim: "Exploration", reverse: true },
  { id: 30, text: "不确定性让我抗拒开始尝试", dim: "Exploration", reverse: true },
  { id: 31, text: "我愿意在小范围先做试验性落地。", dim: "Exploration", reverse: false },
  { id: 32, text: "我能从失败中快速提炼出可迁移的经验。", dim: "Exploration", reverse: false },

  { id: 33, text: "在高压下我仍能保持清晰思考。", dim: "Resilience", reverse: false },
  { id: 34, text: "我能较快从挫败里恢复状态。", dim: "Resilience", reverse: false },
  { id: 35, text: "面对批评时，我更关注事实而非情绪。", dim: "Resilience", reverse: false },
  { id: 36, text: "我能识别并调节自己的压力信号。", dim: "Resilience", reverse: false },
  { id: 37, text: "困难来临时我会明显焦虑甚至停摆", dim: "Resilience", reverse: true },
  { id: 38, text: "消极反馈会让我长时间耿耿于怀", dim: "Resilience", reverse: true },
  { id: 39, text: "我遇到突发状况时容易冲动决策", dim: "Resilience", reverse: true },
  { id: 40, text: "我需要很久才能从失败里走出来", dim: "Resilience", reverse: true },
];

function reverseScore(x: number) { return 6 - x; }
type Answers = Record<number, 1|2|3|4|5|undefined>;

function computeScores(ans: Answers) {
  const buckets: Record<keyof typeof DIMS, number[]> = {
    Drive: [], Influence: [], Cooperation: [], Exploration: [], Resilience: [],
  };
  for (const it of ITEMS) {
    const raw = ans[it.id];
    if (!raw) continue;
    const v = it.reverse ? reverseScore(raw) : raw;
    buckets[it.dim].push(v);
  }
  const byDim = Object.entries(buckets).map(([dim, arr]) => {
    const mean = arr.length ? arr.reduce((a,b)=>a+b,0)/arr.length : 0;
    return { key: dim as keyof typeof DIMS, label: DIMS[dim as keyof typeof DIMS].label, mean: Number(mean.toFixed(2)), count: arr.length };
  });
  const radarData = byDim.map(d => ({ subject: d.label, A: d.mean, fullMark: 5 }));
  const sorted = [...byDim].sort((a,b)=>b.mean-a.mean);
  const top3 = sorted.slice(0,3);
  return { byDim, radarData, top3 };
}

const INTERP: Record<keyof typeof DIMS, { high:string[]; mid:string[]; low:string[]; actions:string[]; }> = {
  Drive: {
    high: ["计划稳定、交付可靠，能把复杂任务拆解并落地。","重视细节，能建立可复用流程。"],
    mid: ["在明确目标下能推进，但易被多任务打断。"],
    low: ["计划随性、收尾不足，建议建立拆解与复盘机制。"],
    actions: ["本周为核心任务列出‘下一步三步’并设定硬截止。","每天固定15分钟复盘，记录一次流程优化。"],
  },
  Influence: {
    high: ["表达清晰，善于说服与公开呈现。","能根据受众调整语言与结构。"],
    mid: ["在熟悉场景表达自然，陌生情境仍需铺垫。"],
    low: ["表达保守，影响力发挥不足，建议刻意练习结构化表达。"],
    actions: ["把本周一次提案压缩成3点结构+1句结论。","刻意练习‘先结论后论据’的电梯演讲。"],
  },
  Cooperation: {
    high: ["共情力强，擅长协同与冲突化解。","乐于正向反馈，带动团队氛围。"],
    mid: ["能基本协作，遇分歧时需要工具与流程支持。"],
    low: ["倾向独立推进，建议引入反馈/对齐的固定节奏。"],
    actions: ["每次会议结束前，复述对齐‘我们已达成的三点’。","为同事送出一次具体且真诚的表扬。"],
  },
  Exploration: {
    high: ["好奇心强，能把新方法快速试点落地。","善于跨域组合形成新解。"],
    mid: ["愿意尝试但受不确定性影响，推进需要锚点。"],
    low: ["沿用旧法，创新动力低，建议做小步试验。"],
    actions: ["为一个痛点开一个‘一周试验’，限定投入与验证指标。","每周阅读并实践一个新工具/方法。"],
  },
  Resilience: {
    high: ["压力下保持稳定与理性，复原快。","能识别并调节情绪信号。"],
    mid: ["多数情况下稳定，重大波动时需要支持。"],
    low: ["压力易积累并影响决策，建议建立稳定的情绪工具箱。"],
    actions: ["在日程中固定10分钟做呼吸/走动/写作卸压。","遇到挫折，用‘事实-感受-下一步’三行法复盘。"],
  },
};

function Header() {
  return (
    <header className="max-w-5xl mx-auto px-4 pt-8 pb-6">
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Open‑Strengths@Work（OSW‑40）</h1>
      <p className="text-sm md:text-base text-gray-500 mt-2">
        公有领域题库打造的“工作优势测评” · 本工具与 Gallup®/CliftonStrengths® 无从属或授权关系。
      </p>
    </header>
  );
}

function StartCard({ onStart }:{ onStart:(opts:{timer:boolean})=>void }){
  const [timer, setTimer] = useState(true);
  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <h2 className="text-xl font-semibold">测评说明</h2>
      <ul className="text-gray-600 text-sm leading-7 mt-3 list-disc pl-5">
        <li>共 40 题，5 点量表（1=非常不同意，5=非常同意）。</li>
        <li>建议凭第一反应作答；无需过度斟酌。</li>
        <li>默认启用每题 20 秒倒计时，超时自动跳到下一题（可关闭）。</li>
        <li>不可回退；未作答题将被忽略计分。</li>
      </ul>
      <div className="flex items-center gap-3 mt-5">
        <label className="inline-flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={timer} onChange={()=>setTimer(v=>!v)} className="h-4 w-4 rounded border-gray-300" />
          <span className="text-sm text-gray-700">启用 20 秒倒计时</span>
        </label>
      </div>
      <div className="mt-6 flex gap-3">
        <button onClick={()=>onStart({timer})} className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90">开始测评</button>
        <a href="#legal" className="px-4 py-2 rounded-xl border text-sm text-gray-700 hover:bg-gray-50">合规/声明</a>
      </div>
    </div>
  );
}

function ProgressBar({ current, total }:{ current:number; total:number }){
  const pct = Math.round((current/total)*100);
  return (
    <div className="w-full bg-gray-200/70 rounded-full h-2 mt-3">
      <div className="h-2 rounded-full bg-gray-900 transition-all" style={{width:`${pct}%`}}/>
    </div>
  );
}

function Likert({ value, onChange }:{ value?:number; onChange:(v:1|2|3|4|5)=>void }){
  const labels = ["非常不同意","不同意","中立","同意","非常同意"];
  return (
    <div className="grid grid-cols-5 gap-2 mt-4">
      {[1,2,3,4,5].map((v,i)=> (
        <button key={v} onClick={()=>onChange(v as 1|2|3|4|5)}
          className={`text-xs md:text-sm px-2 py-2 rounded-xl border transition ${value===v? "border-black bg-black text-white":"border-gray-300 hover:bg-gray-50"}`}>
          <div className="font-medium">{v}</div>
          <div className="mt-1 text-[10px] md:text-[11px] opacity-80">{labels[i]}</div>
        </button>
      ))}
    </div>
  );
}

function TimerBar({ seconds, total=20 }:{ seconds:number; total?:number }){
  const pct = Math.max(0, Math.min(100, Math.round((seconds/total)*100)));
  return (
    <div className="mt-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>剩余 {seconds}s</span><span>每题 {total}s</span>
      </div>
      <div className="w-full bg-gray-200/70 rounded-full h-1.5 mt-1">
        <div className={`h-1.5 rounded-full ${seconds<=5? "bg-red-500":"bg-gray-900"}`} style={{width:`${pct}%`}}/>
      </div>
    </div>
  );
}

function QuestionCard({ item, index, total, value, onAnswer, timerEnabled, onTimeout } : {
  item: (typeof ITEMS)[number];
  index:number; total:number; value?:number;
  onAnswer:(v:1|2|3|4|5)=>void; timerEnabled:boolean; onTimeout:()=>void;
}){
  const [sec, setSec] = useState(20);
  const tickRef = useRef<number | null>(null);

  useEffect(()=>{
    setSec(20);
    if (!timerEnabled) return;
    tickRef.current = window.setInterval(()=>{
      setSec(s=>{
        if (s<=1){
          window.clearInterval(tickRef.current!);
          onTimeout();
          return 0;
        }
        return s-1;
      });
    }, 1000);
    return ()=>{ if (tickRef.current) window.clearInterval(tickRef.current); };
  }, [item.id, timerEnabled]);

  useEffect(()=>{
    const handler = (e: KeyboardEvent)=>{
      if (["1","2","3","4","5"].includes(e.key)) onAnswer(Number(e.key) as 1|2|3|4|5);
    };
    window.addEventListener("keydown", handler);
    return ()=> window.removeEventListener("keydown", handler);
  }, [onAnswer]);

  return (
    <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">第 {index+1} / {total} 题</div>
      </div>
      <ProgressBar current={index+1} total={total} />
      <h3 className="mt-5 text-lg md:text-xl font-semibold leading-relaxed">{item.text}</h3>
      <Likert value={value} onChange={onAnswer} />
      {timerEnabled && <TimerBar seconds={sec} />}
      <p className="mt-4 text-xs text-gray-400">提示：可使用键盘 <span className="font-semibold">1–5</span> 快速作答。</p>
    </div>
  );
}

function Results({ answers, onReset }:{ answers:Answers; onReset:()=>void }){
  const { byDim, radarData, top3 } = useMemo(()=>computeScores(answers), [answers]);

  const download = () => {
    const payload = { type:"OSW-40", timestamp:new Date().toISOString(), answers, summary:{ byDim, top3 } };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type:"application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `OSW40_Report_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const interpNote = (mean:number)=> (mean>=4 ? "高" : mean>=3 ? "中" : "低");

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
        <h2 className="text-xl md:text-2xl font-semibold">你的工作优势画像</h2>
        <p className="text-sm text-gray-500 mt-2">分数范围 1–5，得分越高表示该维度优势越显著。</p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis angle={30} domain={[0,5]} tickCount={6} />
                <Tooltip />
                <Radar name="你" dataKey="A" stroke="#111827" fill="#111827" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3">
            {byDim.map(d=> (
              <div key={d.key} className="flex items-start gap-3 p-3 rounded-xl border">
                <div className="w-2.5 h-2.5 rounded-full mt-2" style={{ background: DIMS[d.key].color }} />
                <div>
                  <div className="font-medium">
                    {DIMS[d.key].label}
                    <span className="ml-2 text-gray-500 text-sm">{d.mean.toFixed(2)}（{interpNote(d.mean)}）</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5">{DIMS[d.key].desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">TOP 3 优势</h3>
          <div className="mt-3 grid md:grid-cols-3 gap-3">
            {top3.map(t=> (
              <div key={t.key} className="border rounded-xl p-4">
                <div className="text-sm text-gray-500">{DIMS[t.key].desc}</div>
                <div className="text-base font-semibold mt-1">{DIMS[t.key].label} · {t.mean}</div>
                <ul className="text-sm text-gray-700 mt-2 list-disc pl-5">
                  {(INTERP[t.key].high.length ? INTERP[t.key].high : ["该维度表现积极。"]).slice(0,2).map((s,i)=>(
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold">本周行动建议</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-3">
            {byDim.map(d=> (
              <div key={d.key} className="border rounded-xl p-4">
                <div className="font-medium">{DIMS[d.key].label}</div>
                <ul className="text-sm text-gray-700 mt-2 list-disc pl-5">
                  {INTERP[d.key].actions.map((a,i)=>(<li key={i}>{a}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button onClick={download} className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50">下载 JSON 报告</button>
          <button onClick={()=>window.print()} className="px-4 py-2 rounded-xl border text-sm hover:bg-gray-50">打印/保存 PDF</button>
          <button onClick={onReset} className="px-4 py-2 rounded-xl bg-black text-white text-sm font-medium hover:opacity-90">重新测评</button>
        </div>
      </div>

      <div id="legal" className="mt-6 text-xs text-gray-500 leading-6">
        <div className="border rounded-2xl p-4">
          <div className="font-medium mb-1">合规与版权声明</div>
          <p>
            Open‑Strengths@Work（OSW‑40）使用公有领域（Public Domain）题项理念与自研文本构建，题库可自由复制、二次创作与商用。
            本工具与 Gallup®、CliftonStrengths® 无任何从属或授权关系；严禁复制/仿制其受版权保护的原题库与报告内容。
          </p>
        </div>
      </div>
    </div>
  );
}

export default function OSWApp(){
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});

  const total = ITEMS.length;
  const current = ITEMS[idx];

  const begin = ({ timer }:{ timer:boolean }) => {
    setStarted(true);
    setFinished(false);
    setIdx(0);
    setAnswers({});
    setTimerEnabled(timer);
  };

  const handleAnswer = (v:1|2|3|4|5) => {
    setAnswers(prev => ({ ...prev, [current.id]: v }));
    if (idx + 1 < total) setIdx(i=>i+1);
    else setFinished(true);
  };

  const handleTimeout = () => {
    if (idx + 1 < total) setIdx(i=>i+1);
    else setFinished(true);
  };

  const resetAll = () => {
    setStarted(false);
    setFinished(false);
    setIdx(0);
    setAnswers({});
  };

  return (
    <div className="min-h-screen text-gray-900">
      <Header />
      <main className="px-4 pb-20">
        {!started && <StartCard onStart={begin} />}
        {started && !finished && (
          <QuestionCard
            item={current}
            index={idx}
            total={total}
            value={answers[current.id]}
            onAnswer={handleAnswer}
            timerEnabled={timerEnabled}
            onTimeout={handleTimeout}
          />
        )}
        {started && finished && <Results answers={answers} onReset={resetAll} />}
      </main>
      <footer className="max-w-5xl mx-auto px-4 pb-10 text-xs text-gray-400">
        <div className="mt-10">© {new Date().getFullYear()} OSW‑Lab. 本页仅用于演示与试运行。</div>
      </footer>
    </div>
  );
}
