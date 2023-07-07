import { gql } from 'apollo-server'

const mutationSchema = gql`
    type Mutation {
        createSource(sourceInput: SourceInput): CreateSourceResponse!
        deleteSource(ID: ID!): CreateSourceResponse!
        editSource(ID: ID!, sourceInput: SourceEditInput): CreateSourceResponse!

        createAmazon(amazonInput: AmazonInput): CreateAmazonResponse!
        deleteAmazon(ID: ID!): CreateAmazonResponse!
        editAmazon(ID: ID!, amazonInput: AmazonEditInput): CreateAmazonResponse!

        createLead(leadInput: LeadInput): CreateLeadResponse!
        createLeadById(leadInput: LeadInput): CreateLeadResponse!
        deleteLead(ID: ID!): CreateLeadResponse!
        editLead(ID: ID!, leadInput: LeadInput): CreateLeadResponse!
    }
`

export default mutationSchema
