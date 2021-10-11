# Refinance Query:

1. get queries created by buyer: `GET /queries?type=refinance_existing_loan`
2. get query response `GET /response?query_uuid=dde4b151-1428-48d4-b9a6-84ebf08e682b`
3. get sellers profile based on location and loan amount: `POST /all-profiles`
   payload:
   ```
   {
       "type" : "fm-seller",
       "city" : "Hyderabad",
       "country": "India",
       "currency": "INR",
       "loan_amount": "100000000" // outstanding_loan_amount value
   }
   ```
4. create query: `POST /queries`
   payload:

   ```
       1. when buyer selects addressbook contacts:
           {
               "type": "refinance_existing_loan",
               "data": {
                   "loan_currency": {
                        "label": "INR",
                        "value": "INR"
                    },
                    "outstanding_loan_amount": "10000000",
                    "loan_type": "",
                    "loan_taken_date": "27/09/2021",
                    "maturity_date": "27/09/2022",
                    "interest_rate": "10%",
                    "funding_bank": "SBI",
                    "attachments": ["link1", "link2"],
                    "remarks_for_the_seller": "helloo test test test test"
               },
               "sellers":{
                   "addressbook_contacts":[
                       {
                           "email": "abc@mail.com",
                           "mobile": "1234567890"
                       },
                       {
                           "email": "xyz@mail.com",
                           "mobile": "9876543210"
                       }
                   ]
               }
           }

       2. when buyer selects sellers based on location:
           {
               "type": "refinance_existing_loan",
               "data": {
                    "loan_currency": {
                        "label": "INR",
                        "value": "INR"
                    },
                    "outstanding_loan_amount": "10000000",
                    "loan_type": "",
                    "loan_taken_date": "27/09/2021",
                    "maturity_date": "27/09/2022",
                    "interest_rate": "10%",
                    "funding_bank": "SBI",
                    "attachments": ["link1", "link2"],
                    "remarks_for_the_seller": "helloo test test test test"
               },
               "sellers":{
                   "buyer_selected_sellers":[
                       "555f3222-613f-440d-9920-b6815a30c6c1",
                       "555f3222-613f-440d-9920-b6815a30c6c2"
                   ]
               },
           }

       3. when buyer selects addressbook contacts and sellers based on location:
           {
               "type": "refinance_existing_loan",
               "data": {
                    "loan_currency": {
                        "label": "INR",
                        "value": "INR"
                    },
                    "outstanding_loan_amount": "10000000",
                    "loan_type": "",
                    "loan_taken_date": "27/09/2021",
                    "maturity_date": "27/09/2022",
                    "interest_rate": "10%",
                    "funding_bank": "SBI",
                    "attachments": ["link1", "link2"],
                    "remarks_for_the_seller": "helloo test test test test"
               },
               "sellers":{
                   "addressbook_contacts":[
                       {
                           "email": "abc@mail.com",
                           "mobile": "1234567890"
                       },
                       {
                           "email": "xyz@mail.com",
                           "mobile": "9876543210"
                       }
                   ],
                   "buyer_selected_sellers":[
                       "555f3222-613f-440d-9920-b6815a30c6c1",
                       "555f3222-613f-440d-9920-b6815a30c6c2"
                   ]
               }
           }

       4. when buyer selects system selected sellers:
           {
               "type": "refinance_existing_loan",
               "data": {
                    "loan_currency": "$",
                    "outstanding_loan_amount": "10000000",
                    "loan_type": "",
                    "loan_taken_date": "27/09/2021",
                    "maturity_date": "27/09/2022",
                    "interest_rate": "10%",
                    "funding_bank": "SBI",
                    "attachments": ["link1", "link2"],
                    "remarks_for_the_seller": "helloo test test test test"
               },
               "sellers":{
                   "system_selected_sellers":{
                       "country": "India",
                       "city": "Hyderabad",
                   }
               }
           }
   ```

# Get QueryResponse with

    - status:   `GET /response?status=status`
    - query uuid:   `GET /response?query_uuid=dde4b151-1428-48d4-b9a6-84ebf08e682b`
    - profile_uuid(profile uuid of who created query): `GET /response?profile_uuid=555f3222-613f-440d-9920-b6815a30c6c1`
    - owner uuid (seller profile uuid of whome query is assigned initially): `GET /response?owner_uuid=555f3222-613f-440d-9920-b6815a30c6c1`
    - assigned uuid(seller profile uuid of whome query is assigned): `GET /response?assigned_uuid=555f3222-613f-440d-9920-b6815a30c6c1`
    // owner_uuid and assigned_uuid can be same, these would be different when seller assign query to someone else
    - interval(get queries on fire , which are created in last 24 hours ): `GET /response?interval=24`

===========================================
wired up generated leads(responses)

    Auto Reject:
        -   update all response with status "rejected"

    Auto Assign:
        -   show criteria
        -   create criteria

    auto_assign_condition table:
        -   uuid - uuid
        -   profile_uuid (if contact is wired up user add profile uuid) - uuid
        -   matching_criteria - JSONB
            -   turnover
            -   location
        - assign_to
            -   type: team member or location based
            -   email
            -   mobile

    POST `/create-autoassign-criteria`
    payload:{
        "matching_criteria": {
            "currency": {
                "label": "INR",
                "value": "INR"
            },
            "range": {
                "label": "25-100",
                "value": "25-100",
                "min_value": "250000000",
                "max_value": "1000000000"
            }
        },
        "assign_to": {
            "type": "team_member",
            "email": "rajesh123@mail.com",
            "mobile": "+917417057634"
        }
    }

    payload2:{
        "matching_criteria": {
            "currency": {
                "label": "INR",
                "value": "INR"
            },
            "range": {
                "label": "25-100",
                "value": "25-100",
                "min_value": "250000000",
                "max_value": "1000000000"
            },
            "city": {
                "label": "Hyderabad",
                "value": "Hyderabad"
            },
            "country": {
                "label": "India",
                "value": "In"
            }
        },
        "assign_to": {
            "type": "location_based",
        }
    }
