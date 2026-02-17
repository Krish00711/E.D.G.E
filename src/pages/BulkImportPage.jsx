import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function BulkImportPage() {
  const [activeTab, setActiveTab] = useState('grades')
  const [csvData, setCsvData] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [preview, setPreview] = useState(null)
  const { user } = useAuth()

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    setCsvData(text)
    
    // Preview data
    const lines = text.trim().split('\n')
    const headers = lines[0].split(',')
    const previewRows = lines.slice(1, 6).map(line => line.split(','))
    setPreview({ headers, rows: previewRows })
  }

  const handleImport = async () => {
    if (!csvData.trim()) {
      setError('Please upload a CSV file')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess('')

      const lines = csvData.trim().split('\n')
      const headers = lines[0].split(',').map(h => h.trim())
      const data = lines.slice(1).map(line => {
        const values = line.split(',')
        const obj = {}
        headers.forEach((header, idx) => {
          obj[header] = values[idx]?.trim()
        })
        return obj
      })

      if (activeTab === 'grades') {
        await api.bulk.importGrades(data)
        setSuccess(`Successfully imported ${data.length} grade records`)
      } else if (activeTab === 'attendance') {
        await api.bulk.importAttendance(data)
        setSuccess(`Successfully imported ${data.length} attendance records`)
      }

      setCsvData('')
      setPreview(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-[#FAF8F4] mb-4">Access Denied</h1>
          <p className="text-[#9CA3AF]">Only administrators can access bulk import</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0E0F13] to-[#16181D] px-4 py-8 pt-32">
      <div className="max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-4xl font-bold text-[#FAF8F4] mb-8">Bulk Import</h1>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-500 rounded-lg p-4 mb-6">
              {success}
            </div>
          )}

          {/* Tabs */}
          <div className="flex gap-4 mb-6 border-b border-[#2A2C31]">
            {['grades', 'attendance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 font-medium transition-colors ${
                  activeTab === tab
                    ? 'text-[#F6B26B] border-b-2 border-[#F6B26B]'
                    : 'text-[#9CA3AF] hover:text-[#FAF8F4]'
                }`}
              >
                {tab === 'grades' ? 'Import Grades' : 'Import Attendance'}
              </button>
            ))}
          </div>

          {/* Upload Section */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-4">
              {activeTab === 'grades' ? 'Upload Grades CSV' : 'Upload Attendance CSV'}
            </h2>

            <div className="mb-6">
              <h3 className="text-[#FAF8F4] font-semibold mb-2">Required Columns:</h3>
              {activeTab === 'grades' ? (
                <p className="text-[#9CA3AF] text-sm">studentId, courseId, assignmentId, grade, feedback</p>
              ) : (
                <p className="text-[#9CA3AF] text-sm">studentId, courseId, date, status, notes</p>
              )}
            </div>

            <div className="border-2 border-dashed border-[#2A2C31] rounded-lg p-8 text-center mb-6">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csvFile"
              />
              <label
                htmlFor="csvFile"
                className="cursor-pointer"
              >
                <div className="text-[#F6B26B] text-3xl mb-2">📄</div>
                <p className="text-[#FAF8F4] font-semibold">Click to upload CSV</p>
                <p className="text-[#9CA3AF] text-sm">or drag and drop</p>
              </label>
            </div>

            {preview && (
              <div className="mb-6">
                <h3 className="text-[#FAF8F4] font-semibold mb-3">Preview (first 5 rows)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-[#0E0F13]">
                      <tr>
                        {preview.headers.map((header, idx) => (
                          <th key={idx} className="px-4 py-2 text-left text-[#9CA3AF]">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#2A2C31]">
                      {preview.rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-[#16181D]">
                          {row.map((cell, cidx) => (
                            <td key={cidx} className="px-4 py-2 text-[#FAF8F4]">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {csvData && (
              <button
                onClick={handleImport}
                disabled={loading}
                className="w-full bg-[#F6B26B] hover:bg-[#E69138] disabled:opacity-50 text-[#0E0F13] font-semibold py-3 rounded-lg transition-colors"
              >
                {loading ? 'Importing...' : 'Import Data'}
              </button>
            )}
          </div>

          {/* CSV Format Guide */}
          <div className="bg-[#1A1C21] border border-[#2A2C31] rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#FAF8F4] mb-4">CSV Format Guide</h2>
            <h3 className="text-[#F6B26B] font-semibold mb-2">Example:</h3>
            {activeTab === 'grades' ? (
              <pre className="bg-[#0E0F13] p-4 rounded text-[#9CA3AF] text-sm overflow-x-auto">
{`studentId,courseId,assignmentId,grade,feedback
student1,course1,assign1,85,Good work
student2,course1,assign1,92,Excellent
student3,course2,assign2,78,Needs improvement`}
              </pre>
            ) : (
              <pre className="bg-[#0E0F13] p-4 rounded text-[#9CA3AF] text-sm overflow-x-auto">
{`studentId,courseId,date,status,notes
student1,course1,2024-02-13,present,
student2,course1,2024-02-13,absent,Sick
student3,course1,2024-02-13,late,Traffic`}
              </pre>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
