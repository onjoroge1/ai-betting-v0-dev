"use client"

import type React from "react"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PlusCircle,
  Edit,
  Trash2,
  ListFilter,
  Search,
  CalendarDays,
  Tag,
  ShieldCheck,
  StarIcon,
  BarChartBig,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Enhanced Prediction type for admin management
type PredictionAdmin = {
  id: string
  match: string // e.g., "Arsenal vs Chelsea"
  league?: string // e.g., "Premier League"
  dateTime: string // ISO string for date and time
  prediction: string // e.g., "Over 2.5 Goals"
  odds?: string // e.g., "1.85"
  confidence?: number // 0-100
  analysis?: string // Detailed analysis
  status: "upcoming" | "live" | "finished" | "postponed" | "cancelled"
  result?: "won" | "lost" | "pending" | "void"
  isFree?: boolean
  // Sectional display flags
  showOnHomepage?: boolean
  showInDailyTips?: boolean
  showInWeeklySpecials?: boolean
  // For specials/accumulators
  type?: "single" | "accumulator" | "special"
  matchesInAccumulator?: string[]
  totalOdds?: string
  stake?: string
  potentialReturn?: string
  valueRating?: "Low" | "Medium" | "High" | "Very High"
  createdAt: string
  updatedAt: string
}

const initialPredictions: PredictionAdmin[] = [
  {
    id: "pred1",
    match: "Arsenal vs Chelsea",
    league: "Premier League",
    dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days from now
    prediction: "Over 2.5 Goals",
    odds: "1.85",
    confidence: 92,
    analysis: "Both teams scoring freely. Expect goals.",
    status: "upcoming",
    isFree: true,
    showOnHomepage: true,
    showInDailyTips: true,
    type: "single",
    valueRating: "High",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pred2",
    match: "Man City vs Liverpool",
    league: "Premier League",
    dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
    prediction: "BTTS",
    odds: "1.65",
    confidence: 88,
    analysis: "Key offensive players in form for both sides.",
    status: "upcoming",
    isFree: false,
    showInDailyTips: true,
    type: "single",
    valueRating: "Medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pred3",
    match: "Weekend Accumulator",
    league: "Various",
    dateTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days from now
    prediction: "Multi-Leg Accumulator",
    matchesInAccumulator: ["Barcelona Win", "Bayern Over 2.5", "PSG BTTS"],
    totalOdds: "8.50",
    confidence: 85,
    analysis: "Carefully selected legs for this weekend special.",
    status: "upcoming",
    isFree: false,
    showInWeeklySpecials: true,
    type: "accumulator",
    valueRating: "High",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pred4",
    match: "Real Madrid vs Atletico Madrid",
    league: "La Liga",
    dateTime: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // Yesterday
    prediction: "Real Madrid Win",
    odds: "2.00",
    confidence: 90,
    analysis: "Madrid derby, Real dominated.",
    status: "finished",
    result: "won",
    isFree: true,
    showInDailyTips: false, // Assuming it was true before finishing
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export function AdminPredictionManagement() {
  const [predictions, setPredictions] = useState<PredictionAdmin[]>(initialPredictions)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPrediction, setEditingPrediction] = useState<PredictionAdmin | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentTab, setCurrentTab] = useState<"all" | "homepage" | "daily" | "specials">("all")

  const handleAddNew = () => {
    setEditingPrediction(null)
    setIsModalOpen(true)
  }

  const handleEdit = (prediction: PredictionAdmin) => {
    setEditingPrediction(prediction)
    setIsModalOpen(true)
  }

  const handleDelete = (predictionId: string) => {
    // Add confirmation dialog here in a real app
    setPredictions(predictions.filter((p) => p.id !== predictionId))
  }

  const handleSavePrediction = (formData: PredictionAdmin) => {
    if (editingPrediction) {
      setPredictions(
        predictions.map((p) =>
          p.id === editingPrediction.id ? { ...formData, id: p.id, updatedAt: new Date().toISOString() } : p,
        ),
      )
    } else {
      setPredictions([
        ...predictions,
        {
          ...formData,
          id: `pred${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ])
    }
    setIsModalOpen(false)
    setEditingPrediction(null)
  }

  const filteredPredictions = useMemo(() => {
    return predictions
      .filter((p) => {
        if (currentTab === "homepage") return p.showOnHomepage
        if (currentTab === "daily") return p.showInDailyTips
        if (currentTab === "specials") return p.showInWeeklySpecials
        return true // 'all' tab
      })
      .filter(
        (p) =>
          p.match.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.league?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.prediction.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime())
  }, [predictions, searchTerm, currentTab])

  const PredictionForm = ({
    isOpen,
    onClose,
    onSave,
    initialData,
  }: {
    isOpen: boolean
    onClose: () => void
    onSave: (data: PredictionAdmin) => void
    initialData: PredictionAdmin | null
  }) => {
    const [formData, setFormData] = useState<Partial<PredictionAdmin>>(
      initialData || {
        status: "upcoming",
        isFree: true,
        type: "single",
        dateTime: new Date().toISOString().slice(0, 16), // For datetime-local input
      },
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target
      if (type === "checkbox") {
        setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked })
      } else if (type === "number") {
        setFormData({ ...formData, [name]: Number.parseFloat(value) })
      } else {
        setFormData({ ...formData, [name]: value })
      }
    }

    const handleSelectChange = (name: string, value: string) => {
      setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      // Basic validation
      if (!formData.match || !formData.prediction || !formData.dateTime) {
        alert("Match, Prediction, and Date/Time are required.")
        return
      }
      onSave(formData as PredictionAdmin) // Cast as full PredictionAdmin, assuming all fields are filled
    }

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px] bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-emerald-400">
              {initialData ? "Edit Prediction" : "Add New Prediction"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              Fill in the details for the match prediction.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="match" className="text-slate-300">
                  Match (e.g., Team A vs Team B)
                </Label>
                <Input
                  id="match"
                  name="match"
                  value={formData.match || ""}
                  onChange={handleChange}
                  required
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="league" className="text-slate-300">
                  League
                </Label>
                <Input
                  id="league"
                  name="league"
                  value={formData.league || ""}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="dateTime" className="text-slate-300">
                Date & Time
              </Label>
              <Input
                id="dateTime"
                name="dateTime"
                type="datetime-local"
                value={formData.dateTime ? new Date(formData.dateTime).toISOString().slice(0, 16) : ""}
                onChange={handleChange}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div>
              <Label htmlFor="prediction" className="text-slate-300">
                Prediction (e.g., Over 2.5 Goals)
              </Label>
              <Input
                id="prediction"
                name="prediction"
                value={formData.prediction || ""}
                onChange={handleChange}
                required
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="odds" className="text-slate-300">
                  Odds (e.g., 1.85)
                </Label>
                <Input
                  id="odds"
                  name="odds"
                  value={formData.odds || ""}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="confidence" className="text-slate-300">
                  Confidence (0-100)
                </Label>
                <Input
                  id="confidence"
                  name="confidence"
                  type="number"
                  value={formData.confidence || ""}
                  onChange={handleChange}
                  min="0"
                  max="100"
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="valueRating" className="text-slate-300">
                Value Rating
              </Label>
              <Select
                name="valueRating"
                value={formData.valueRating}
                onValueChange={(value) => handleSelectChange("valueRating", value)}
              >
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select value rating" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="Low" className="hover:bg-slate-700">
                    Low
                  </SelectItem>
                  <SelectItem value="Medium" className="hover:bg-slate-700">
                    Medium
                  </SelectItem>
                  <SelectItem value="High" className="hover:bg-slate-700">
                    High
                  </SelectItem>
                  <SelectItem value="Very High" className="hover:bg-slate-700">
                    Very High
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="analysis" className="text-slate-300">
                Analysis
              </Label>
              <Textarea
                id="analysis"
                name="analysis"
                value={formData.analysis || ""}
                onChange={handleChange}
                rows={3}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="status" className="text-slate-300">
                  Status
                </Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange("status", value)}
                  required
                >
                  <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-700 text-white">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                    <SelectItem value="finished">Finished</SelectItem>
                    <SelectItem value="postponed">Postponed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {formData.status === "finished" && (
                <div>
                  <Label htmlFor="result" className="text-slate-300">
                    Result
                  </Label>
                  <Select
                    name="result"
                    value={formData.result}
                    onValueChange={(value) => handleSelectChange("result", value)}
                  >
                    <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 text-white">
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="won">Won</SelectItem>
                      <SelectItem value="lost">Lost</SelectItem>
                      <SelectItem value="void">Void</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="type" className="text-slate-300">
                Prediction Type
              </Label>
              <Select name="type" value={formData.type} onValueChange={(value) => handleSelectChange("type", value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700 text-white">
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="accumulator">Accumulator</SelectItem>
                  <SelectItem value="special">Special Event</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === "accumulator" && (
              <div>
                <Label htmlFor="matchesInAccumulator" className="text-slate-300">
                  Matches in Accumulator (comma-separated)
                </Label>
                <Input
                  id="matchesInAccumulator"
                  name="matchesInAccumulator"
                  value={Array.isArray(formData.matchesInAccumulator) ? formData.matchesInAccumulator.join(", ") : ""}
                  onChange={(e) =>
                    setFormData({ ...formData, matchesInAccumulator: e.target.value.split(",").map((s) => s.trim()) })
                  }
                  className="bg-slate-700 border-slate-600 text-white"
                />
                <Label htmlFor="totalOdds" className="text-slate-300 mt-2 block">
                  Total Odds for Accumulator
                </Label>
                <Input
                  id="totalOdds"
                  name="totalOdds"
                  value={formData.totalOdds || ""}
                  onChange={handleChange}
                  className="bg-slate-700 border-slate-600 text-white"
                />
              </div>
            )}
            {(formData.type === "special" || formData.type === "accumulator") && (
              <>
                <div>
                  <Label htmlFor="stake" className="text-slate-300">
                    Recommended Stake (e.g., KES 1000)
                  </Label>
                  <Input
                    id="stake"
                    name="stake"
                    value={formData.stake || ""}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="potentialReturn" className="text-slate-300">
                    Potential Return (e.g., KES 5000)
                  </Label>
                  <Input
                    id="potentialReturn"
                    name="potentialReturn"
                    value={formData.potentialReturn || ""}
                    onChange={handleChange}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </>
            )}

            <div className="space-y-2 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isFree"
                  name="isFree"
                  checked={formData.isFree}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFree: !!checked })}
                />
                <Label htmlFor="isFree" className="text-slate-300">
                  Free Tip (Visible to all users)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showOnHomepage"
                  name="showOnHomepage"
                  checked={formData.showOnHomepage}
                  onCheckedChange={(checked) => setFormData({ ...formData, showOnHomepage: !!checked })}
                />
                <Label htmlFor="showOnHomepage" className="text-slate-300">
                  Show on Homepage (Featured)
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showInDailyTips"
                  name="showInDailyTips"
                  checked={formData.showInDailyTips}
                  onCheckedChange={(checked) => setFormData({ ...formData, showInDailyTips: !!checked })}
                />
                <Label htmlFor="showInDailyTips" className="text-slate-300">
                  Show in Daily Tips
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showInWeeklySpecials"
                  name="showInWeeklySpecials"
                  checked={formData.showInWeeklySpecials}
                  onCheckedChange={(checked) => setFormData({ ...formData, showInWeeklySpecials: !!checked })}
                />
                <Label htmlFor="showInWeeklySpecials" className="text-slate-300">
                  Show in Weekly Specials
                </Label>
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="text-slate-300 border-slate-600 hover:bg-slate-700"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                Save Prediction
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    )
  }

  const getStatusBadge = (status: PredictionAdmin["status"]) => {
    switch (status) {
      case "upcoming":
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Upcoming</Badge>
      case "live":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30 animate-pulse">Live</Badge>
      case "finished":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Finished</Badge>
      case "postponed":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Postponed</Badge>
      case "cancelled":
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Cancelled</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getResultBadge = (result?: PredictionAdmin["result"]) => {
    if (!result) return null
    switch (result) {
      case "won":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Won</Badge>
      case "lost":
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Lost</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
      case "void":
        return <Badge className="bg-slate-500/20 text-slate-400 border-slate-500/30">Void</Badge>
      default:
        return <Badge variant="secondary">{result}</Badge>
    }
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-emerald-400 flex items-center">
          <BarChartBig className="w-6 h-6 mr-3 text-emerald-500" />
          Prediction Management
        </CardTitle>
        <Button onClick={handleAddNew} className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add New Prediction
        </Button>
      </CardHeader>
      <CardContent>
        <Tabs value={currentTab} onValueChange={(value) => setCurrentTab(value as any)} className="mb-4">
          <TabsList className="grid w-full grid-cols-4 bg-slate-700/50 border-slate-600">
            <TabsTrigger value="all" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              All Predictions
            </TabsTrigger>
            <TabsTrigger value="homepage" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Homepage
            </TabsTrigger>
            <TabsTrigger value="daily" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Daily Tips
            </TabsTrigger>
            <TabsTrigger value="specials" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white">
              Weekly Specials
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center justify-between mb-4">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search predictions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-700 border-slate-600 text-white placeholder-slate-400"
            />
          </div>
          <Button variant="outline" className="ml-2 text-slate-300 border-slate-600 hover:bg-slate-700">
            <ListFilter className="w-4 h-4 mr-2" />
            Filters
          </Button>
        </div>

        <div className="overflow-x-auto rounded-md border border-slate-700">
          <Table>
            <TableHeader className="bg-slate-900/50">
              <TableRow className="border-slate-700">
                <TableHead className="text-white">Match</TableHead>
                <TableHead className="text-white">Prediction</TableHead>
                <TableHead className="text-white">Date/Time</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Result</TableHead>
                <TableHead className="text-white">Sections</TableHead>
                <TableHead className="text-white text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPredictions.length > 0 ? (
                filteredPredictions.map((p) => (
                  <TableRow key={p.id} className="border-slate-700 hover:bg-slate-700/30">
                    <TableCell>
                      <div className="font-medium text-white">{p.match}</div>
                      <div className="text-xs text-slate-400">{p.league}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-white">{p.prediction}</div>
                      <div className="text-xs text-slate-400">
                        {p.odds && `Odds: ${p.odds}`} {p.confidence && `| Conf: ${p.confidence}%`}
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-300">{new Date(p.dateTime).toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(p.status)}</TableCell>
                    <TableCell>{getResultBadge(p.result)}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {p.showOnHomepage && (
                          <Badge variant="outline" className="border-purple-500 text-purple-400">
                            <StarIcon className="w-3 h-3 mr-1" />
                            Homepage
                          </Badge>
                        )}
                        {p.showInDailyTips && (
                          <Badge variant="outline" className="border-sky-500 text-sky-400">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            Daily
                          </Badge>
                        )}
                        {p.showInWeeklySpecials && (
                          <Badge variant="outline" className="border-amber-500 text-amber-400">
                            <Tag className="w-3 h-3 mr-1" />
                            Special
                          </Badge>
                        )}
                        {p.isFree === false && (
                          <Badge variant="outline" className="border-yellow-400 text-yellow-300">
                            <ShieldCheck className="w-3 h-3 mr-1" />
                            VIP
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(p)}
                        className="text-emerald-400 hover:text-emerald-300 mr-1"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(p.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-slate-700">
                  <TableCell colSpan={7} className="text-center text-slate-400 py-8">
                    No predictions found for the current filter or tab.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {isModalOpen && (
          <PredictionForm
            isOpen={isModalOpen}
            onClose={() => {
              setIsModalOpen(false)
              setEditingPrediction(null)
            }}
            onSave={handleSavePrediction}
            initialData={editingPrediction}
          />
        )}
      </CardContent>
    </Card>
  )
}
