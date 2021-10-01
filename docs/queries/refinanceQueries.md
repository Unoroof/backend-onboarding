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
                   "initial": {
                       "refinance_details":{
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
                       }
                   }
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
               },
               "status": "open"
           }

       2. when buyer selects sellers based on location:
           {
               "type": "refinance_existing_loan",
               "data": {
                   "initial": {
                       "refinance_details":{
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
                       }
                   }
               },
               "sellers":{
                   "buyer_selected_sellers":[
                       "555f3222-613f-440d-9920-b6815a30c6c1",
                       "555f3222-613f-440d-9920-b6815a30c6c2"
                   ]
               },
               "status": "open"
           }

       3. when buyer selects addressbook contacts and sellers based on location:
           {
               "type": "refinance_existing_loan",
               "data": {
                   "initial": {
                       "refinance_details":{
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
                       }
                   }
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
               },
               "status": "open"
           }

       4. when buyer selects system selected sellers:
           {
               "type": "refinance_existing_loan",
               "data": {
                   "initial": {
                       "refinance_details":{
                           "loan_currency": "$",
                           "outstanding_loan_amount": "10000000",
                           "loan_type": "",
                           "loan_taken_date": "27/09/2021",
                           "maturity_date": "27/09/2022",
                           "interest_rate": "10%",
                           "funding_bank": "SBI",
                           "attachments": ["link1", "link2"],
                           "remarks_for_the_seller": "helloo test test test test"
                       }
                   }
               },
               "sellers":{
                   "system_selected_sellers":{
                       "country": "India",
                       "city": "Hyderabad",
                   }
               },
               "status": "open"
           }
   ```
