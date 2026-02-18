import React, { useState, useEffect } from 'react'

interface Time {
  hour?: string
  minute: string
  second: string
}

interface Station {
  id: string
  name: string
  hour?: string
  minute?: string
  second?: string
  track?: string
  major?: boolean
  splitTimes?: {
    arr: Time
    dep: Time
  }
  note?: string
  marker?: 'triangle' | 'reverse-triangle'
  isEmpty?: boolean
}

interface StationRowProps extends Station {}

const StationRow = ({
  name,
  hour,
  minute,
  second,
  track,
  major = false,
  splitTimes,
  note,
  marker,
  isEmpty,
}: StationRowProps) => {
  if (isEmpty) {
    return (
      <div className="grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-b border-black h-10">
        <div className="border-r border-black h-full"></div>
        <div className="border-r border-black h-full"></div>
        <div className="border-r border-black h-full"></div>
        <div className="border-r border-black h-full"></div>
        <div className="h-full"></div>
      </div>
    )
  }

  let cell2: React.ReactNode = null
  let cell3: React.ReactNode = null
  let cell4: React.ReactNode = null
  let cell5: React.ReactNode = null

  if (splitTimes) {
    const { arr, dep } = splitTimes
    if (arr.hour && dep.hour) {
      cell2 = (
        <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
          <span>{arr.hour}</span>
          <span>{dep.hour}</span>
        </div>
      )
    }
    cell3 = (
      <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
        <span>{arr.minute}</span>
        <span className="font-bold text-xl">{dep.minute}</span>
      </div>
    )
    cell4 = (
      <div className="flex flex-col items-center justify-center h-full text-lg leading-none gap-1">
        <span>{arr.second}</span>
        <span className="font-bold text-xl">{dep.second}</span>
      </div>
    )
  } else {
    if (hour) {
      cell2 = <div className="text-xl font-mono">{hour}</div>
    }
    cell3 = <div className={`${hour ? 'text-xl' : 'text-lg'} font-mono`}>{minute}</div>
    cell4 = <div className={`${hour ? 'text-xl' : 'text-lg'} font-mono`}>{second}</div>
  }

  cell5 = (
    <div className="flex items-center justify-center h-full gap-2 px-1">
      <div className="flex flex-col items-center justify-center gap-0.5">
        {marker === 'reverse-triangle' && (
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-r-[8px] border-r-black mb-1" />
        )}
        {track && (
          <div className="border border-black rounded-full w-5 h-5 flex items-center justify-center text-[0.75rem] leading-none">
            {track}
          </div>
        )}
        {marker === 'triangle' && (
          <div className="w-0 h-0 border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent border-l-[8px] border-l-black mt-1" />
        )}
      </div>
      {note && (
        <div className="text-[0.6rem] text-left leading-tight border-l border-black pl-1 h-full flex items-center">
          {note}
        </div>
      )}
    </div>
  )

  return (
    <div
      className={`grid grid-cols-[2fr_0.8fr_0.8fr_0.8fr_0.8fr] border-b border-black items-center ${major ? 'bg-[#ff8a8a]' : ''} ${splitTimes ? 'h-16' : 'h-10'}`}
    >
      <div
        className={`flex items-center border-r border-black h-full px-2 font-bold ${major ? 'text-lg' : ''}`}
      >
        {name}
      </div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell2}</div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell3}</div>
      <div className="flex items-center justify-center border-r border-black h-full">{cell4}</div>
      <div className="flex items-center justify-center h-full">{cell5}</div>
    </div>
  )
}

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-[#1f2937] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-lg">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <span className="material-icons-round">close</span>
          </button>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}

function App() {
  // Persistence Keys
  const STORAGE_KEY_CONFIG = 'diagen_config'
  const STORAGE_KEY_STATIONS = 'diagen_stations'

  const [district, setDistrict] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CONFIG + '_district') || '仮想検証区'
  })
  const [trainNo, setTrainNo] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CONFIG + '_trainNo') || 'V-777X'
  })
  const [type, setType] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CONFIG + '_type') || 'Limited Exp'
  })
  const [destination, setDestination] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_CONFIG + '_destination') || '未来都市'
  })

  const [stations, setStations] = useState<Station[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_STATIONS)
    if (saved) return JSON.parse(saved)
    return [
      { id: '1', name: '起点港', hour: '08', minute: '00', second: '00', track: 'A', major: true },
      { id: '2', name: '(信号所α)', minute: '02', second: '15', track: 'B' },
      { id: '3', name: '(仮想野)', minute: '05', second: '30', track: 'C' },
      { id: '4', name: '(試験原)', minute: '07', second: '45' },
      { id: '5', name: '', isEmpty: true },
      { id: '6', name: '(デモ崎)', minute: '10', second: '00', track: 'D' },
      { id: '7', name: '(开发林)', minute: '12', second: '20' },
      {
        id: '8',
        name: '検証中央',
        splitTimes: { arr: { minute: '15', second: '00' }, dep: { minute: '17', second: '00' } },
        major: true,
        track: '1',
        marker: 'triangle',
      },
      { id: '9', name: '(コード谷)', minute: '20', second: '30', track: '2' },
      { id: '10', name: '(ビット湖)', minute: '23', second: '45', track: '2' },
      { id: '11', name: '(数据森)', minute: '25', second: '10', track: '3' },
      { id: '12', name: '(应用原)', minute: '28', second: '55', track: '4' },
      { id: '13', name: '', isEmpty: true },
      { id: '14', name: '(系统海)', minute: '32', second: '10' },
      {
        id: '15',
        name: 'プロトタウン',
        splitTimes: { arr: { minute: '35', second: '00' }, dep: { minute: '37', second: '00' } },
        major: true,
        track: '5',
        marker: 'reverse-triangle',
        note: '×仮想特急 通過',
      },
      { id: '16', name: '(スクリプト川)', minute: '40', second: '20' },
      { id: '17', name: '(コンパイル山)', minute: '43', second: '45' },
      { id: '18', name: '(リンク村)', minute: '46', second: '15', track: '2' },
      { id: '19', name: '(ビルド地)', minute: '49', second: '30', track: '1' },
      {
        id: '20',
        name: '未来都市',
        splitTimes: {
          arr: { hour: '09', minute: '00', second: '00' },
          dep: { hour: '09', minute: '05', second: '00' },
        },
        major: true,
        track: '9',
        marker: 'triangle',
      },
      { id: '21', name: '(终点信号)', minute: '07', second: '30', track: 'X' },
      { id: '22', name: '(エンド点)', minute: '10', second: '00' },
      { id: '23', name: '', isEmpty: true },
      {
        id: '24',
        name: '試験終了駅',
        splitTimes: { arr: { minute: '15', second: '20' }, dep: { minute: '16', second: '20' } },
        major: true,
        track: '0',
      },
      { id: '25', name: '', isEmpty: true },
      {
        id: '26',
        name: 'テスト终着',
        hour: '09',
        minute: '20',
        second: '45',
        track: 'Z',
        major: true,
        marker: 'triangle',
      },
    ]
  })

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG + '_district', district)
    localStorage.setItem(STORAGE_KEY_CONFIG + '_trainNo', trainNo)
    localStorage.setItem(STORAGE_KEY_CONFIG + '_type', type)
    localStorage.setItem(STORAGE_KEY_CONFIG + '_destination', destination)
  }, [district, trainNo, type, destination])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_STATIONS, JSON.stringify(stations))
  }, [stations])

  // Station Editing Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Partial<Station>>({})

  const openEditModal = (index: number) => {
    setEditingIndex(index)
    setFormData({ ...stations[index] })
    setIsModalOpen(true)
  }

  const openAddModal = () => {
    setEditingIndex(null)
    setFormData({ id: crypto.randomUUID(), name: '', minute: '00', second: '00' })
    setIsModalOpen(true)
  }

  const saveStation = () => {
    if (editingIndex !== null) {
      const newStations = [...stations]
      newStations[editingIndex] = formData as Station
      setStations(newStations)
    } else {
      setStations([...stations, formData as Station])
    }
    setIsModalOpen(false)
  }

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null)

  const deleteStation = (index: number) => {
    setDeletingIndex(index)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (deletingIndex !== null) {
      const newStations = stations.filter((_, i) => i !== deletingIndex)
      setStations(newStations)
      setIsDeleteModalOpen(false)
      setDeletingIndex(null)
    }
  }

  const moveStation = (index: number, direction: 'up' | 'down') => {
    const newStations = [...stations]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= stations.length) return
    ;[newStations[index], newStations[targetIndex]] = [newStations[targetIndex], newStations[index]]
    setStations(newStations)
  }

  return (
    <div className="bg-[#f3f4f6] dark:bg-[#111827] text-gray-900 dark:text-gray-100 min-h-screen font-sans transition-colors duration-200">
      <nav className="bg-white dark:bg-[#1f2937] border-b border-gray-200 dark:border-gray-700 px-6 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <span className="material-icons-round text-[#ef4444] text-3xl">train</span>
          <h1 className="text-xl font-bold tracking-tight">
            DiaGen <span className="text-xs font-normal opacity-70 ml-1">POC Edition</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round text-gray-500 dark:text-gray-400">settings</span>
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <span className="material-icons-round text-gray-500 dark:text-gray-400">
              help_outline
            </span>
          </button>
          <div className="h-8 w-8 rounded-full bg-[#ef4444] text-white flex items-center justify-center font-bold text-sm">
            JD
          </div>
        </div>
      </nav>

      <main className="flex h-[calc(100vh-65px)] overflow-hidden">
        <aside className="w-80 bg-white dark:bg-[#1f2937] border-r border-gray-200 dark:border-gray-700 overflow-y-auto p-6 flex flex-col gap-6 shrink-0">
          <div>
            <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 mb-4 tracking-wider">
              Train Configuration
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  District Name
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Train No.
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    value={trainNo}
                    onChange={(e) => setTrainNo(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Type
                  </label>
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
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination
                </label>
                <input
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200 dark:border-gray-700" />

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm font-bold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                Schedule Entries
              </h2>
              <button
                onClick={openAddModal}
                className="text-[#ef4444] hover:text-[#b91c1c] text-xs font-bold flex items-center gap-1"
              >
                <span className="material-icons-round text-sm">add</span> Add
              </button>
            </div>
            <div className="space-y-2 overflow-y-auto pr-2">
              {stations.map((s, i) => (
                <div
                  key={s.id || i}
                  className={`group relative flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 border ${s.isEmpty ? 'border-dashed border-gray-300 dark:border-gray-600 opacity-50' : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700'} transition-all`}
                >
                  <div
                    className={`h-8 w-1 shrink-0 rounded-full ${s.major ? 'bg-[#ef4444]' : 'bg-gray-300 dark:bg-gray-600'}`}
                  ></div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold truncate">
                      {s.isEmpty ? 'Empty Slot' : s.name}
                    </div>
                    {!s.isEmpty && (
                      <div className="text-xs text-gray-500 font-mono">
                        {s.hour || s.splitTimes?.arr.hour || '--'}:{s.minute || s.splitTimes?.arr.minute}:
                        {s.second || s.splitTimes?.arr.second || '00'}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => moveStation(i, 'up')}
                      disabled={i === 0}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <span className="material-icons-round text-sm">arrow_upward</span>
                    </button>
                    <button
                      onClick={() => moveStation(i, 'down')}
                      disabled={i === stations.length - 1}
                      className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    >
                      <span className="material-icons-round text-sm">arrow_downward</span>
                    </button>
                    <button
                      onClick={() => openEditModal(i)}
                      className="p-1 text-gray-400 hover:text-[#ef4444]"
                    >
                      <span className="material-icons-round text-sm">edit</span>
                    </button>
                    <button
                      onClick={() => deleteStation(i)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <span className="material-icons-round text-sm">delete</span>
                    </button>
                  </div>
                </div>
              ))}
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
                    <div className="text-right pr-4 font-bold">车次</div>
                    <div className="font-mono text-lg font-bold">{trainNo}</div>
                    <div className="text-right pr-4 font-bold">种别</div>
                    <div className="font-bold">{type === 'Limited Exp' ? '特急' : type}</div>
                    <div className="text-right pr-4 font-bold">行先</div>
                    <div className="font-bold">{destination}</div>
                    <div className="text-right pr-4 font-bold">备注</div>
                    <div></div>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4">
                  <div className="bg-[#dc2626] w-full h-full rounded-2xl border-4 border-black flex items-center justify-center shadow-[0_0_0_2px_rgba(255,255,255,1)_inset]">
                    <span className="text-white text-8xl font-black tracking-widest font-noto">
                      特急
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 border-r border-black flex flex-col">
                  {stations.slice(0, Math.ceil(stations.length / 2)).map((s, i) => (
                    <StationRow key={s.id || i} {...s} />
                  ))}
                  <div className="flex-1 border-b border-black"></div>
                </div>
                <div className="flex-1 flex flex-col">
                  {stations.slice(Math.ceil(stations.length / 2)).map((s, i) => (
                    <StationRow key={s.id || i + Math.ceil(stations.length / 2)} {...s} />
                  ))}
                  <div className="flex-1 border-b border-black last:border-b-0"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this station?
            {deletingIndex !== null && !stations[deletingIndex].isEmpty && (
              <span className="block font-bold text-gray-900 dark:text-white mt-1">
                {stations[deletingIndex].name}
              </span>
            )}
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={confirmDelete}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 rounded-lg transition-colors"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingIndex !== null ? 'Edit Station' : 'Add Station'}
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 mb-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.isEmpty}
                onChange={(e) => setFormData({ ...formData, isEmpty: e.target.checked })}
                className="rounded text-[#ef4444] focus:ring-[#ef4444]"
              />
              Is Empty Slot
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.major}
                onChange={(e) => setFormData({ ...formData, major: e.target.checked })}
                className="rounded text-[#ef4444] focus:ring-[#ef4444]"
              />
              Major Station
            </label>
          </div>

          {!formData.isEmpty && (
            <>
              <div>
                <label htmlFor="stationName" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Station Name
                </label>
                <input
                  id="stationName"
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="stationHour" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Hour
                  </label>
                  <input
                    id="stationHour"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    placeholder="e.g. 08"
                    value={formData.hour || ''}
                    onChange={(e) => setFormData({ ...formData, hour: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="stationMinute" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Minute
                  </label>
                  <input
                    id="stationMinute"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    value={formData.minute || ''}
                    onChange={(e) => setFormData({ ...formData, minute: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="stationSecond" className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Second
                  </label>
                  <input
                    id="stationSecond"
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    value={formData.second || ''}
                    onChange={(e) => setFormData({ ...formData, second: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Track
                  </label>
                  <input
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    type="text"
                    value={formData.track || ''}
                    onChange={(e) => setFormData({ ...formData, track: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    Marker
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                    value={formData.marker || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        marker: e.target.value as Station['marker'],
                      })
                    }
                  >
                    <option value="">None</option>
                    <option value="triangle">Triangle (Dep)</option>
                    <option value="reverse-triangle">Rev Triangle (Arr)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Note</label>
                <input
                  className="w-full rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ef4444] outline-none"
                  type="text"
                  value={formData.note || ''}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <div className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800/50">
                <label className="flex items-center gap-2 text-sm font-bold mb-3">
                  <input
                    type="checkbox"
                    checked={!!formData.splitTimes}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          splitTimes: {
                            arr: { minute: '00', second: '00' },
                            dep: { minute: '01', second: '00' },
                          },
                        })
                      } else {
                        const { splitTimes, ...rest } = formData
                        setFormData(rest)
                      }
                    }}
                    className="rounded text-[#ef4444] focus:ring-[#ef4444]"
                  />
                  Use Split Times (Arr/Dep)
                </label>
                {formData.splitTimes && (
                  <div className="space-y-3 pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-xs font-medium py-2">Arrival</div>
                      <input
                        className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#ef4444]"
                        placeholder="M"
                        value={formData.splitTimes.arr.minute}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            splitTimes: {
                              ...formData.splitTimes!,
                              arr: { ...formData.splitTimes!.arr, minute: e.target.value },
                            },
                          })
                        }
                      />
                      <input
                        className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#ef4444]"
                        placeholder="S"
                        value={formData.splitTimes.arr.second}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            splitTimes: {
                              ...formData.splitTimes!,
                              arr: { ...formData.splitTimes!.arr, second: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="text-xs font-medium py-2">Departure</div>
                      <input
                        className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#ef4444]"
                        placeholder="M"
                        value={formData.splitTimes.dep.minute}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            splitTimes: {
                              ...formData.splitTimes!,
                              dep: { ...formData.splitTimes!.dep, minute: e.target.value },
                            },
                          })
                        }
                      />
                      <input
                        className="rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm outline-none focus:ring-1 focus:ring-[#ef4444]"
                        placeholder="S"
                        value={formData.splitTimes.dep.second}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            splitTimes: {
                              ...formData.splitTimes!,
                              dep: { ...formData.splitTimes!.dep, second: e.target.value },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="pt-4 flex gap-3">
            <button
              onClick={saveStation}
              className="flex-1 bg-[#ef4444] hover:bg-[#dc2626] text-white font-bold py-2 rounded-lg transition-colors"
            >
              Save Station
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 font-bold py-2 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default App
