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

    ===================

    ```
        {
            "type": "corporate_finance_product",
            "data": {
                "product": {
                    "label": "Financial",
                    "value": "935e0f46-3785-42c0-8cd4-91dcfd50b84d"
                },
                "details":"",
                "expiry_detail":{
                    "validity": "",
                    "response_restriction": ""
                }
            },
            "sellers": {
                "system_selected_sellers": {
                    "country": "India",
                    "city": "Hyderabad"
                }
            },
            "status": "open"
        }

```

Auto assign refactoring:
- when buyer create query and assign to seller
- query response created
- wiredup leads should assign to
    if(assign_wiredup_leads_to==='me') assign to seller
    if(assign_wiredup_leads_to==='reject') don't assign, just reject it
    if(assign_wiredup_leads_to==='auto_assign') auto_assign based on criteria

======================================
1.  *- usecase:
       - user selected product type in refinance query
       - redirected to askwiredupforpartner screen
       - here how to prefill product drop down as we are showing
       master list of product which is non financing products and user has selected financing product  (loantype/producttype)
       - need to handle this case: we can merge both financing and non-financing products
2.  *- correct the api call which is in seller dashboard for showing query reponses
```

[
{
"version": 1,
"user_id": "69420b26-c35e-49a0-97c3-fa653f068071",
"timestamp": 1643374231,
"event_type": "send_rate_alert",
"message_id": "staging-9bcdda92-0557-4a07-b061-1a68cafa2d09",
"data": {
"pair": "USD/INR",
"type": "ASK",
"alert_id": "17",
"operation": "Less than",
"trigger_value": 80,
"live_rate_value": "74.6600",
"screen_name": "FxLive"
}
},
{
"cin": "",
"city": [],
"logo": "",
"range": "",
"country": [],
"domestic": "no",
"exporter": "no",
"importer": "no",
"inr_cost": "",
"lc_limit": "no",
"usd_cost": "",
"collateral": "",
"sblc_limit": "no",
"company_name": "betalectic",
"requirements": "Test test",
"buyer_segment": [],
"currency_type": { "label": "INR", "value": "INR" },
"export_volume": {},
"funded_credit": "",
"import_volume": {},
"need_overseas": "no",
"borrowing_type": "unsecured",
"query_category": {
"label": "Long tenor Finance",
"value": "Long tenor Finance"
},
"cash_equivalent": "",
"immvoable_asset": "",
"current_products": [],
"financing_amount": "5000",
"large_cap_volume": "",
"acquired_overseas": "no",
"financial_Patners": [],
"non_funded_credit": "",
"borrowing_inr_cost": "",
"borrowing_usd_cost": "",
"funded_utilization": "",
"large_cap_supplier": "no",
"subsidiary_or_branch": "no",
"supplier_discounting": "no",
"support_parent_credit": "no",
"non_funded_utilization": "",
"credit_rating_long_term": [{ "agency": "", "rating": "" }],
"financing_currency_type": { "label": "INR", "value": "INR" },
"credit_rating_short_term": [{ "agency": "", "rating": "" }],
"current_utilization_volume": "",
"total_current_credit_volume": "",
"current_utilization_currency": [],
"total_current_credit_currency": []
},
{
"cin": "",
"city": [],
"logo": "",
"range": "",
"country": [],
"product": {
"label": "Banking for E-Commerce/Digital Companies",
"value": "7e3f2598-0ed3-4d4d-8214-776a8706b981"
},
"domestic": "no",
"exporter": "no",
"importer": "no",
"inr_cost": "",
"lc_limit": "no",
"usd_cost": "",
"collateral": "",
"sblc_limit": "no",
"company_name": "Betalectic",
"requirements": "test",
"buyer_segment": [],
"currency_type": { "label": "INR", "value": "INR" },
"export_volume": {},
"funded_credit": "",
"import_volume": {},
"borrowing_type": "unsecured",
"cash_equivalent": "",
"immvoable_asset": "",
"current_products": [],
"financing_amount": "200000",
"large_cap_volume": "",
"financial_Patners": [],
"non_funded_credit": "",
"borrowing_inr_cost": "",
"borrowing_usd_cost": "",
"funded_utilization": "",
"large_cap_supplier": "no",
"supplier_discounting": "no",
"non_funded_utilization": "",
"credit_rating_long_term": [{ "agency": "", "rating": "" }],
"financing_currency_type": { "label": "INR", "value": "INR" },
"credit_rating_short_term": [{ "agency": "", "rating": "" }],
"current_utilization_volume": "",
"total_current_credit_volume": "",
"current_utilization_currency": [],
"total_current_credit_currency": []
},
{
"data": {
"city": { "label": "Hyderabad", "value": "Hyderabad" },
"logo": "",
"email": "manasa@betalectic.com",
"range": {
"label": "26-50",
"value": "26-50",
"max_value": "50000000",
"min_value": "26000000"
},
"mobile": "+919959866341",
"country": { "label": "India", "value": "IN" },
"full_name": "Manasa M",
"designation": "BDM",
"company_name": "Betalectic.com",
"currency_type": { "label": "USD", "value": "USD" },
"profile_picture": "",
"privacy_preference": false,
"additional_company_details": {}
},
"type": "fm-buyer",
"uuid": "62ecde50-7014-46db-b4e2-201fb8d4ecb7",
"status": "completed",
"createdAt": "2022-01-12T14:38:50.304Z",
"updatedAt": "2022-02-03T09:49:44.528Z",
"user_uuid": "57828590-5238-4bca-a5e9-3a94b2872e01"
}
]
