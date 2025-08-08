
export interface Customer {
  id: string
  firstName: string
  lastName: string
  age: number
  gender: string
  localGovernment: string
  state: string
  householdSize: number
}

export const customers: Customer[] = [
  {
    id: "CU001",
    firstName: "John",
    lastName: "Doe",
    age: 32,
    gender: "Male",
    localGovernment: "Ikeja",
    state: "Lagos",
    householdSize: 4
  },
  {
    id: "CU002",
    firstName: "Jane",
    lastName: "Smith",
    age: 28,
    gender: "Female",
    localGovernment: "Victoria Island",
    state: "Lagos",
    householdSize: 2
  },
  {
    id: "CU003",
    firstName: "Michael",
    lastName: "Johnson",
    age: 45,
    gender: "Male",
    localGovernment: "Garki",
    state: "FCT",
    householdSize: 6
  },
  {
    id: "CU004",
    firstName: "Emily",
    lastName: "Davis",
    age: 35,
    gender: "Female",
    localGovernment: "Surulere",
    state: "Lagos",
    householdSize: 3
  },
  {
    id: "CU005",
    firstName: "David",
    lastName: "Wilson",
    age: 29,
    gender: "Male",
    localGovernment: "Wuse",
    state: "FCT",
    householdSize: 1
  },
  {
    id: "CU006",
    firstName: "Sarah",
    lastName: "Brown",
    age: 41,
    gender: "Female",
    localGovernment: "Yaba",
    state: "Lagos",
    householdSize: 5
  },
  {
    id: "CU007",
    firstName: "Robert",
    lastName: "Garcia",
    age: 38,
    gender: "Male",
    localGovernment: "Maitama",
    state: "FCT",
    householdSize: 4
  },
  {
    id: "CU008",
    firstName: "Lisa",
    lastName: "Miller",
    age: 33,
    gender: "Female",
    localGovernment: "Lekki",
    state: "Lagos",
    householdSize: 2
  },
  {
    id: "CU009",
    firstName: "Christopher",
    lastName: "Anderson",
    age: 27,
    gender: "Male",
    localGovernment: "Asokoro",
    state: "FCT",
    householdSize: 3
  },
  {
    id: "CU010",
    firstName: "Amanda",
    lastName: "Taylor",
    age: 36,
    gender: "Female",
    localGovernment: "Ikoyi",
    state: "Lagos",
    householdSize: 4
  }
]
