const sendEmailToAdmin = require("./neptune/neptuneCaller");

module.exports = async (enquiry, profile) => {
  try {
    console.log("check", enquiry);
    if (enquiry.type === "for_partner") {
      await sendEmailToAdmin({
        event_type: "user_raised_partner_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: profile.data.full_name ? profile.data.full_name : "-",
          company_name: enquiry.data.company_name
            ? enquiry.data.company_name
            : "-",
          cin_number: enquiry.data.cin ? enquiry.data.cin : "-",
          turnover: enquiry.data.range ? enquiry.data.range : "-",
          buyer_segment: enquiry.data.buyer_segment
            ? enquiry.data.buyer_segment
            : "-",
          product_name: enquiry.data.current_products
            ? enquiry.data.current_products.toString()
            : "-",
          currency: enquiry.data.currency_type.value
            ? enquiry.data.currency_type.value
            : "-",
          loan_amount: enquiry.data.financing_amount
            ? enquiry.data.financing_amount
            : enquiry.data.financing_amount,
          max_interest_rate_inr: enquiry.data.inr_cost
            ? enquiry.data.inr_cost
            : "-", // %
          max_interest_rate_usd: enquiry.data.usd_cost
            ? enquiry.data.usd_cost
            : "-", // %
          description: enquiry.data.requirements
            ? enquiry.data.requirements
            : "-",
          exporter: enquiry.data.exporter ? enquiry.data.exporter : "No",
          importer: enquiry.data.importer ? enquiry.data.importer : "No",
          domestic: enquiry.data.domestic ? enquiry.data.domestic : "No",
          borrowing: enquiry.data.borrowing_type
            ? enquiry.data.borrowing_type
            : "Unsecured",
          borrowing_cost: enquiry.data.collateral
            ? enquiry.data.collateral
            : "-",
          credit_rating_long:
            enquiry.data.credit_rating_long_term.length > 0
              ? enquiry.data.credit_rating_long_term[0].rating
              : "-",
          credit_rating_short:
            enquiry.data.credit_rating_short_term.length > 0
              ? enquiry.data.credit_rating_short_term[0].rating
              : "-",
          current_financial_partner:
            enquiry.data.financial_Patners.length > 0
              ? enquiry.data.financial_Patners
              : "-",
          sblc_limit: enquiry.data.sblc_limit ? enquiry.data.sblc_limit : "No", // yes/no
          lc_limit: enquiry.data.lc_limit ? enquiry.data.lc_limit : "No", // yes/no
          supplier: enquiry.data.large_cap_supplier
            ? enquiry.data.large_cap_supplier
            : "No", // yes/no
          supplier_bill_discounting: enquiry.data.supplier_discounting
            ? enquiry.data.supplier_discounting
            : "No", // yes/no
          credit_amount: enquiry.data.total_current_credit_volume
            ? enquiry.data.total_current_credit_volume
            : "-",
          credit_currency: enquiry.data.total_current_credit_currency
            ? enquiry.data.total_current_credit_currency.label
            : "-",
          credit_funded_limit: enquiry.data.funded_credit
            ? enquiry.data.funded_credit.label
            : "-",
          credit_non_funded_limit: enquiry.data.non_funded_credit
            ? enquiry.data.non_funded_credit.label
            : "-",
          current_amount: enquiry.data.current_utilization_volume
            ? enquiry.data.current_utilization_volume
            : "-",
          current_currency: enquiry.data.current_utilization_currency
            ? enquiry.data.current_utilization_currency.label
            : "-",
          current_funded_limit: enquiry.data.funded_utilization
            ? enquiry.data.funded_utilization.label
            : "-",
          current_non_funded_limit: enquiry.data.non_funded_utilization
            ? enquiry.data.non_funded_utilization.label
            : "-",
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    } else if (enquiry.type === "for_product") {
      await sendEmailToAdmin({
        event_type: "user_raised_product_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: profile.data.full_name ? profile.data.full_name : "-",
          company_name: enquiry.data.company_name
            ? enquiry.data.company_name
            : "-",
          cin_number: enquiry.data.cin ? enquiry.data.cin : "-",
          turnover: enquiry.data.range ? enquiry.data.range : "-",
          buyer_segment: enquiry.data.buyer_segment
            ? enquiry.data.buyer_segment.label
            : "-",
          product_name: enquiry.data.current_products
            ? enquiry.data.current_products.toString()
            : "-",
          currency: enquiry.data.currency_type.value
            ? enquiry.data.currency_type.value
            : "-",
          loan_amount: enquiry.data.financing_amount
            ? enquiry.data.financing_amount
            : enquiry.data.financing_amount,
          max_interest_rate_inr: enquiry.data.inr_cost
            ? enquiry.data.inr_cost
            : "-", // %
          max_interest_rate_usd: enquiry.data.usd_cost
            ? enquiry.data.usd_cost
            : "-", // %
          description: enquiry.data.requirements
            ? enquiry.data.requirements
            : "-",
          exporter: enquiry.data.exporter ? enquiry.data.exporter : "No",
          importer: enquiry.data.importer ? enquiry.data.importer : "No",
          domestic: enquiry.data.domestic ? enquiry.data.domestic : "No",
          borrowing: enquiry.data.borrowing_type
            ? enquiry.data.borrowing_type
            : "Unsecured",
          borrowing_cost: enquiry.data.collateral
            ? enquiry.data.collateral
            : "-",
          credit_rating_long:
            enquiry.data.credit_rating_long_term.length > 0
              ? enquiry.data.credit_rating_long_term[0].rating
              : "-",
          credit_rating_short:
            enquiry.data.credit_rating_short_term.length > 0
              ? enquiry.data.credit_rating_short_term[0].rating
              : "-",
          current_financial_partner:
            enquiry.data.financial_Patners.length > 0
              ? enquiry.data.financial_Patners
              : "-",
          sblc_limit: enquiry.data.sblc_limit ? enquiry.data.sblc_limit : "No", // yes/no
          lc_limit: enquiry.data.lc_limit ? enquiry.data.lc_limit : "No", // yes/no
          supplier: enquiry.data.large_cap_supplier
            ? enquiry.data.large_cap_supplier
            : "No", // yes/no
          supplier_bill_discounting: enquiry.data.supplier_discounting
            ? enquiry.data.supplier_discounting
            : "No", // yes/no
          credit_amount: enquiry.data.total_current_credit_volume
            ? enquiry.data.total_current_credit_volume
            : "-",
          credit_currency: enquiry.data.total_current_credit_currency
            ? enquiry.data.total_current_credit_currency.label
            : "-",
          credit_funded_limit: enquiry.data.funded_credit
            ? enquiry.data.funded_credit.label
            : "-",
          credit_non_funded_limit: enquiry.data.non_funded_credit
            ? enquiry.data.non_funded_credit.label
            : "-",
          current_amount: enquiry.data.current_utilization_volume
            ? enquiry.data.current_utilization_volume
            : "-",
          current_currency: enquiry.data.current_utilization_currency
            ? enquiry.data.current_utilization_currency.label
            : "-",
          current_funded_limit: enquiry.data.funded_utilization
            ? enquiry.data.funded_utilization.label
            : "-",
          current_non_funded_limit: enquiry.data.non_funded_utilization
            ? enquiry.data.non_funded_utilization.label
            : "-",
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    } else if (enquiry.type === "for_credit_profile") {
      await sendEmailToAdmin({
        event_type: "user_raised_credit_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
          buyer_name: "Shubham",
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    }
  } catch (error) {
    console.log("check here", error);
  }
};
