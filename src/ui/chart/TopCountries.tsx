import React from "react";
import {TopCountriesResponse} from "../../common/models/TopCountriesResponse";
import {Table} from "antd";

const Columns = [{
  title: "Country",
  dataIndex: "countryRegion",
  key: "countryRegion",
}, {
  title: "New Cases",
  dataIndex: "newCases",
  key: "newCases",
}]

export function TopCountries({topCountries}: {topCountries: TopCountriesResponse}) {
  return <Table columns={Columns} dataSource={topCountries} />;
}
