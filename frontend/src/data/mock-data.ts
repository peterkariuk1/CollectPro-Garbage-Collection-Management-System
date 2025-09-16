export interface Plot {
  id: string
  name: string
  location: string
  caretakerName: string
  caretakerPhone: string
  type: "lumpsum" | "individual"
  units: number
  image?: string
  lumpsumExpected?: number
  feePerTenant?: 200 | 250
  mpesaNumber?: string
  totalExpected: number
  totalPaid: number
  totalUnpaid: number
}

export interface Tenant {
  id: string
  plotId: string
  name: string
  phone: string
  fee: 200 | 250
  status: "paid" | "unpaid" | "pending"
  datePaid?: string
  mpesaRef?: string
}

export interface Payment {
  id: string
  plotId: string
  tenantId?: string
  amount: number
  status: "paid" | "unpaid" | "pending"
  month: string
  year: number
  mpesaRef?: string
  receivedAt?: string
}

// Mock data
export const mockPlots: Plot[] = [
  {
    id: "plot-1",
    name: "Hunters Ridge Apartments",
    location: "Hunters Road, Kileleshwa",
    caretakerName: "John Mwangi",
    caretakerPhone: "+254712345678",
    type: "individual",
    units: 12,
    feePerTenant: 250,
    totalExpected: 3000,
    totalPaid: 2250,
    totalUnpaid: 750,
  },
  {
    id: "plot-2", 
    name: "Green Valley Estate",
    location: "Valley Road, Westlands",
    caretakerName: "Mary Wanjiku",
    caretakerPhone: "+254723456789",
    type: "lumpsum",
    units: 8,
    lumpsumExpected: 2000,
    mpesaNumber: "+254723456789",
    totalExpected: 2000,
    totalPaid: 2000,
    totalUnpaid: 0,
  },
  {
    id: "plot-3",
    name: "Sunrise Courts",
    location: "Ngong Road, Karen",
    caretakerName: "Peter Kiprotich",
    caretakerPhone: "+254734567890",
    type: "individual",
    units: 16,
    feePerTenant: 200,
    totalExpected: 3200,
    totalPaid: 1800,
    totalUnpaid: 1400,
  },
  {
    id: "plot-4",
    name: "City Centre Plaza",
    location: "CBD, Nairobi",
    caretakerName: "Grace Akinyi",
    caretakerPhone: "+254745678901",
    type: "lumpsum",
    units: 20,
    lumpsumExpected: 5000,
    mpesaNumber: "+254745678901",
    totalExpected: 5000,
    totalPaid: 0,
    totalUnpaid: 5000,
  },
  {
    id: "plot-5",
    name: "Parklands Heights",
    location: "Parklands Road",
    caretakerName: "David Mutua",
    caretakerPhone: "+254756789012",
    type: "individual", 
    units: 24,
    feePerTenant: 250,
    totalExpected: 6000,
    totalPaid: 4500,
    totalUnpaid: 1500,
  },
  {
    id: "plot-6",
    name: "Lavington Gardens",
    location: "Lavington, Dagoretti",
    caretakerName: "Susan Njeri",
    caretakerPhone: "+254767890123",
    type: "individual",
    units: 10,
    feePerTenant: 200,
    totalExpected: 2000,
    totalPaid: 1600,
    totalUnpaid: 400,
  }
]

export const mockTenants: Tenant[] = [
  // Hunters Ridge Apartments tenants
  { id: "t1", plotId: "plot-1", name: "Alice Wanjiru", phone: "+254711111111", fee: 250, status: "paid", datePaid: "2024-09-05", mpesaRef: "QHX123456" },
  { id: "t2", plotId: "plot-1", name: "Bob Kinyua", phone: "+254722222222", fee: 250, status: "paid", datePaid: "2024-09-03", mpesaRef: "QHX123457" },
  { id: "t3", plotId: "plot-1", name: "Carol Muthoni", phone: "+254733333333", fee: 250, status: "unpaid" },
  { id: "t4", plotId: "plot-1", name: "Daniel Kiprono", phone: "+254744444444", fee: 250, status: "paid", datePaid: "2024-09-08", mpesaRef: "QHX123458" },
  { id: "t5", plotId: "plot-1", name: "Emma Nyambura", phone: "+254755555555", fee: 250, status: "paid", datePaid: "2024-09-01", mpesaRef: "QHX123459" },
  { id: "t6", plotId: "plot-1", name: "Frank Ochieng", phone: "+254766666666", fee: 250, status: "pending" },
  { id: "t7", plotId: "plot-1", name: "Grace Wambui", phone: "+254777777777", fee: 250, status: "paid", datePaid: "2024-09-07", mpesaRef: "QHX123460" },
  { id: "t8", plotId: "plot-1", name: "Henry Macharia", phone: "+254788888888", fee: 250, status: "paid", datePaid: "2024-09-04", mpesaRef: "QHX123461" },
  { id: "t9", plotId: "plot-1", name: "Irene Wairimu", phone: "+254799999999", fee: 250, status: "paid", datePaid: "2024-09-06", mpesaRef: "QHX123462" },
  { id: "t10", plotId: "plot-1", name: "Joseph Gitau", phone: "+254700000000", fee: 250, status: "unpaid" },
  { id: "t11", plotId: "plot-1", name: "Karen Mwende", phone: "+254701111111", fee: 250, status: "paid", datePaid: "2024-09-09", mpesaRef: "QHX123463" },
  { id: "t12", plotId: "plot-1", name: "Luke Ndungu", phone: "+254702222222", fee: 250, status: "unpaid" },

  // Sunrise Courts tenants
  { id: "t13", plotId: "plot-3", name: "Nancy Karanja", phone: "+254703333333", fee: 200, status: "paid", datePaid: "2024-09-02", mpesaRef: "QHX123464" },
  { id: "t14", plotId: "plot-3", name: "Oscar Kimani", phone: "+254704444444", fee: 200, status: "paid", datePaid: "2024-09-05", mpesaRef: "QHX123465" },
  { id: "t15", plotId: "plot-3", name: "Peris Wanjiku", phone: "+254705555555", fee: 200, status: "unpaid" },
  { id: "t16", plotId: "plot-3", name: "Quinn Mwangi", phone: "+254706666666", fee: 200, status: "paid", datePaid: "2024-09-01", mpesaRef: "QHX123466" },
  { id: "t17", plotId: "plot-3", name: "Rachel Nyokabi", phone: "+254707777777", fee: 200, status: "paid", datePaid: "2024-09-03", mpesaRef: "QHX123467" },
  { id: "t18", plotId: "plot-3", name: "Samuel Kibet", phone: "+254708888888", fee: 200, status: "unpaid" },
  { id: "t19", plotId: "plot-3", name: "Teresa Wamaitha", phone: "+254709999999", fee: 200, status: "paid", datePaid: "2024-09-07", mpesaRef: "QHX123468" },
  { id: "t20", plotId: "plot-3", name: "Victor Otieno", phone: "+254710000000", fee: 200, status: "paid", datePaid: "2024-09-04", mpesaRef: "QHX123469" },
  { id: "t21", plotId: "plot-3", name: "Winnie Mutheu", phone: "+254711000000", fee: 200, status: "unpaid" },
  { id: "t22", plotId: "plot-3", name: "Xavier Korir", phone: "+254712000000", fee: 200, status: "paid", datePaid: "2024-09-08", mpesaRef: "QHX123470" },
  { id: "t23", plotId: "plot-3", name: "Yvonne Kamau", phone: "+254713000000", fee: 200, status: "unpaid" },
  { id: "t24", plotId: "plot-3", name: "Zachary Munyao", phone: "+254714000000", fee: 200, status: "unpaid" },
  { id: "t25", plotId: "plot-3", name: "Agnes Mwikali", phone: "+254715000000", fee: 200, status: "paid", datePaid: "2024-09-06", mpesaRef: "QHX123471" },
  { id: "t26", plotId: "plot-3", name: "Brian Keter", phone: "+254716000000", fee: 200, status: "unpaid" },
  { id: "t27", plotId: "plot-3", name: "Cynthia Muthoni", phone: "+254717000000", fee: 200, status: "unpaid" },
  { id: "t28", plotId: "plot-3", name: "Dennis Wekesa", phone: "+254718000000", fee: 200, status: "unpaid" },
]

// Calculate monthly summary
export function getMonthlysummary() {
  const totalExpected = mockPlots.reduce((sum, plot) => sum + plot.totalExpected, 0)
  const totalPaid = mockPlots.reduce((sum, plot) => sum + plot.totalPaid, 0)
  const totalUnpaid = totalExpected - totalPaid
  const collectionRate = Math.round((totalPaid / totalExpected) * 100)
  
  return {
    totalRevenue: totalPaid,
    totalExpected,
    totalPaid,
    totalUnpaid,
    collectionRate,
    totalPlots: mockPlots.length,
    totalUnits: mockPlots.reduce((sum, plot) => sum + plot.units, 0)
  }
}