import { gql } from 'apollo-server'

const statusSchema = gql`
    type Status {
        success: Boolean!
        message: String
    }
`

export default statusSchema
