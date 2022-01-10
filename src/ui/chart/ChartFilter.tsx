import React from "react";
import Form from "antd/lib/form";
import {Button, DatePicker, Input} from "antd";

export interface ChartFilterType {
  from: string;
  to: string;
  country: string;
}

export function ChartFilter({onFilter, loading}: {onFilter: (filter: ChartFilterType) => void, loading: boolean}) {
  const onFinish = (filter: any) => {
    onFilter({
      from: filter.from.format("YYYY-MM-DD"),
      to: filter.to.format("YYYY-MM-DD"),
      country: filter.country,
    });
  }

  return (
    <Form onFinish={onFinish} layout="inline">
      <Form.Item key="from" label="Start Date" name="from">
        <DatePicker picker="date" />
      </Form.Item>
      <Form.Item key="to" label="End Date" name="to">
        <DatePicker picker="date" />
      </Form.Item>
      <Form.Item key="country" label="Country" name="country">
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>Filter</Button>
      </Form.Item>
    </Form>
  );
}
