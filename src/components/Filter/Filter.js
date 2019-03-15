import React from "react";

import Input from "../Input/Input";

import "./Filter.css";

const Filter = () => (
  <aside aria-labelledby="filter">
    <h1 id="filter">Filter</h1>
    <Input id="language" label="Language or technology" key="language" />
    <Input id="location" label="Location" key="location" />
  </aside>
);

export default Filter;
