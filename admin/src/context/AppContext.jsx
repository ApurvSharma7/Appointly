import { createContext } from "react";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        if (!slotDate) return "N/A"

        let dateArray;
        if (slotDate.includes('_')) {
            // Case: 20_01_2000
            dateArray = slotDate.split('_')
            return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
        } else if (slotDate.includes('-')) {
            // Case: 2024-01-20
            dateArray = slotDate.split('-')
            return dateArray[2] + " " + months[Number(dateArray[1]) - 1] + " " + dateArray[0]
        } else {
            return slotDate
        }
    }

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        const today = new Date()
        const birthDate = new Date(dob)
        let age = today.getFullYear() - birthDate.getFullYear()
        return age
    }

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider