import { matchSorter } from "match-sorter";
import universityData from "../../data/university_data.json";

const colleges = universityData.map((college) => {
    return {
        name: college.name,
        address:college.address
    }
})

const searchAlgorithm = (input) => {
    return matchSorter(colleges, input, {keys: ['name', 'address']})
}
export default searchAlgorithm;