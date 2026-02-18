import React, { useState } from 'react';

interface Time {
  hour?: string;
  minute: string;
  second: string;
}

interface Station {
  name: string;
  hour?: string;
  minute?: string;
  second?: string;
  track?: string;
  major?: boolean;
  splitTimes?: {
    arr: Time;
    dep: Time;
  };
  note?: string;
  marker?: 'triangle' | 'reverse-triangle';
  isEmpty?: boolean;
}

interface StationRowProps extends Station {}

const StationRow = ({ name, hour, minute, second, track, major = false, splitTimes, note, marker, isEmpty }: StationRowProps) => {
  if (isEmpty) {
    return <div className="grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-b border-black h-10">
      <div className="border-r border-black h-full"></div>
      <div className="border-r border-black h-full"></div>
      <div className="border-r border-black h-full"></div>
      <div className="border-r border-black h-full"></div>
      <div className="h-full"></div>
    </div>;
  }

  // Consistent column mapping for Japanese train schedules:
  // Col 1: Name
  // Col 2: Hour (Empty if omitted)
  // Col 3: Minute
  // Col 4: Second
  // Col 5: Track / Marker / Note

  let cell2: React.ReactNode = null;
  let cell3: React.ReactNode = null;
  let cell4: React.ReactNode = null;
  let cell5: React.ReactNode = null;

  if (splitTimes) {
    const { arr, dep } = splitTimes;

    // Hour Cell (Col 2)
    if (arr.hour && dep.hour) {
      cell2 = (
        <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
          <span>{arr.hour}</span>
          <span>{dep.hour}</span>
        </div>
      );
    }

    // Minute Cell (Col 3)
    cell3 = (
      <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
        <span>{arr.minute}</span>
        <span className="font-bold text-xl">{dep.minute}</span>
      </div>
    );

    // Second Cell (Col 4)
    cell4 = (
      <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
        <span>{arr.second}</span>
        <span className="font-bold text-xl">{dep.second}</span>
      </div>
    );
  } else {
    // Single time
    if (hour) {
      cell2 = <div className="text-xl font-mono">{hour}</div>;
    }
    cell3 = <div className={`${hour ? 'text-xl' : 'text-lg'} font-mono`}>{minute}</div>;
    cell4 = <div className={`${hour ? 'text-xl' : 'text-lg'} font-mono`}>{second}</div>;
  }

  // Miscellaneous Cell (Col 5): Track, Marker, and Note
  cell5 = (
    <div className="flex items-center justify-center h-full gap-2 px-1">
      <div className="flex flex-col items-center justify-center gap-0.5">
        {marker === 'reverse-triangle' && <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-black mb-1" />}
        {track && (
          <div className="border border-black rounded-full w-5 h-5 flex items-center justify-center text-[0.75rem] leading-none">
            {track}
          </div>
        )}
        {marker === 'triangle' && <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-black mt-1" />}
      </div>
      {note && (
        <div className="text-[0.6rem] text-left leading-tight border-l border-black pl-1 h-full flex items-center">
          {note}
        </div>
      )}
    </div>
  );

  return (
    <div className={`grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-b border-black items-center ${major ? 'bg-[#ff8a8a]' : ''} ${splitTimes ? 'h-16' : 'h-10'}`}>
      <div className={`flex items-center border-r border-black h-full px-2 font-bold ${major ? 'text-lg' : ''}`}>{name}</div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell2}</div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell3}</div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell4}</div>
      <div className="flex items-center justify-center h-full">{cell5}</div>
    </div>
  );
};

function App() {
  const [district, setDistrict] = useState("大道寺列車区");
  const [trainNo, setTrainNo] = useState("610A");
  const [type, setType] = useState("Limited Exp");
  const [destination, setDestination] = useState("大手橋");

  const [stations, setStations] = useState<Station[]>([
    { name: "館浜", hour: "06", minute: "30", second: "00", track: "1", major: true },
    { name: "(駒野)", minute: "31", second: "25", track: "2" },
    { name: "(津崎)", minute: "35", second: "15", track: "2" },
    { name: "(浜園)", minute: "36", second: "10" },
    { name: "", isEmpty: true },
    { name: "(新野崎)", minute: "38", second: "15", track: "2" },
    { name: "(江原 信)", minute: "39", second: "45" },
    { name: "大道寺", splitTimes: { arr: { minute: "41", second: "00" }, dep: { minute: "42", second: "00" } }, major: true, track: "1", marker: 'triangle' },
    { name: "(藤江)", minute: "43", second: "55", track: "2" },
    { name: "(水越)", minute: "45", second: "00", track: "2" },
    { name: "(高見沢)", minute: "46", second: "40", track: "1" },
    { name: "(日野森)", minute: "48", second: "10", track: "2" },
    { name: "", isEmpty: true },
    { name: "(西赤山)", minute: "49", second: "40" },
    { name: "赤山町", splitTimes: { arr: { minute: "52", second: "00" }, dep: { minute: "53", second: "00" } }, major: true, track: "1", marker: 'reverse-triangle', note: "×特急 館浜" },
    { name: "(三郷)", minute: "55", second: "20" },
    { name: "(珠川 信)", minute: "57", second: "05" },
    { name: "(上吉沢)", minute: "58", second: "35", track: "2" },
    { name: "(下吉沢)", minute: "59", second: "40", track: "1" },
    { name: "名田", splitTimes: { arr: { hour: "07", minute: "01", second: "15" }, dep: { hour: "07", minute: "03", second: "25" } }, major: true, track: "1", marker: 'triangle' },
    { name: "(三石)", minute: "04", second: "40", track: "2" },
    { name: "(二木戸)", minute: "05", second: "30" },
    { name: "", isEmpty: true },
    { name: "東井", splitTimes: { arr: { minute: "07", second: "10" }, dep: { minute: "08", second: "10" } }, major: true, track: "1" },
    { name: "", isEmpty: true },
    { name: "新大路", hour: "07", minute: "10", second: "20", track: "1", major: true, marker: 'triangle' },
  ]);

  const editStation = (index: number) => {
    const s = stations[index];
    if (s.isEmpty) return;
    const newName = prompt("Station Name", s.name);
    if (newName !== null) {
      const newStations = [...stations];
      newStations[index] = { ...s, name: newName };
      setStations(newStations);
    }
  };

  return (
    <div className="bg-[#f3f4f6] dark:bg-[#111827] text-gray-900 dark:text-gray-100 min-h-screen font-sans transition-colors duration-200">
      <nav className="bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-icons-round text-[#ef4444] text-3xl">train</span>
          <h1 className="text-xl font-bold tracking-tight">DiaGen <span className="text-xs font-normal opacity-70 ml-1">Enterprise Edition</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round text-gray-500 dark:text-gray-400">settings</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round text-gray-500 dark:text-gray-400">help_outline</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-bold text-sm">
            JD
          </div>
        </div>
      </nav>

      <main className="flex h-[calc(100vh-65px)] overflow-hidden">
        <aside className="w-80 bg-white dark:bg-[#1f2937] border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6 flex flex-col gap-6 shrink-0">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">Train Configuration</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">District Name</label>
                <input
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Train No.</label>
                  <input
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    value={trainNo}
                    onChange={(e) => setTrainNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                  <select
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                  >
                    <option>Limited Exp</option>
                    <option>Express</option>
                    <option>Local</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Destination</label>
                <input
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700"/>

          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">Schedule Entries</h2>
              <button className="text-[#ef4444] hover:text-[#b91c1c] text-xs font-bold flex items-center gap-1">
                <span className="material-icons-round text-sm">add</span> Add
              </button>
            </div>
            <div className="space-y-2">
              {stations.map((s, originalIndex) => ({ s, originalIndex }))
                .filter(item => !item.s.isEmpty)
                .slice(0, 5)
                .map(({ s, originalIndex }) => (
                <div key={originalIndex} className="group flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                  <div className={`h-8 w-1 rounded-full ${s.major ? 'bg-[#ef4444]' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">{s.name}</div>
                    <div className="text-xs text-gray-500 font-mono">
                      {s.hour || (s.splitTimes?.arr.hour) || (originalIndex > 18 ? '07' : '06')}:{s.minute || (s.splitTimes?.arr.minute)}:{s.second || (s.splitTimes?.arr.second) || '00'}
                    </div>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-[#ef4444]" onClick={() => editStation(originalIndex)}>
                    <span className="material-icons-round text-sm">edit</span>
                  </button>
                </div>
              ))}
              <div className="text-center text-xs text-gray-400 py-2 italic">And {stations.filter(s => !s.isEmpty).length - 5} more stations...</div>
            </div>
          </div>

          <div className="mt-auto">
            <button className="w-full bg-[#ef4444] hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all">
              <span className="material-icons-round">print</span> Export PDF
            </button>
          </div>
        </aside>

        <section className="flex-1 bg-gray-100 dark:bg-black p-8 overflow-auto flex justify-center items-start">
          <div className="schedule-paper bg-white text-black shadow-2xl w-[800px] min-h-[1000px] border border-gray-300 dark:border-gray-700 relative box-border transition-all">
            <div className="border border-black m-8 h-[calc(100%-4rem)] flex flex-col">
              <div className="grid grid-cols-2 h-48 border-b border-black">
                <div className="p-4 border-r border-black flex flex-col">
                  <div className="text-sm font-bold mb-4">{district}</div>
                  <div className="grid grid-cols-[1fr_2fr] gap-y-1 text-sm pl-4">
                    <div className="text-right pr-4 font-bold">列車番号</div>
                    <div className="font-mono text-lg font-bold">{trainNo}</div>
                    <div className="text-right pr-4 font-bold">種別</div>
                    <div className="font-bold">{type === 'Limited Exp' ? '特急' : type}</div>
                    <div className="text-right pr-4 font-bold">行先</div>
                    <div className="font-bold">{destination}</div>
                    <div className="text-right pr-4 font-bold">備考</div>
                    <div></div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4">
                  <div className="bg-[#dc2626] w-full h-full rounded-2xl border-4 border-black flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,1)_inset]">
                    <span className="text-white text-8xl font-black tracking-widest font-noto">特急</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 border-r border-black flex flex-col">
                  {stations.slice(0, 18).map((s, i) => (
                    <StationRow key={i} {...s} />
                  ))}
                  <div className="flex-1 border-b border-black"></div>
                </div>
                <div className="flex-1 flex flex-col">
                  {stations.slice(18).map((s, i) => (
                    <StationRow key={i} {...s} />
                  ))}
                  <div className="flex-1 border-b border-black last:border-b-0"></div>
                </div>
              </div>
            </div>

            <div className="fixed bottom-6 right-8 flex flex-col gap-3">
              <button className="bg-white dark:bg-[#1f2937] p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                <span className="material-icons-round">add</span>
              </button>
              <button className="bg-white dark:bg-[#1f2937] p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform">
                <span className="material-icons-round">remove</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
