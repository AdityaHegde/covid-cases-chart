import {Schema} from "mongoose";

export const CovidDataMongooseSchema = new Schema({
  date: String,
  fips: String,
  county: String,
  provinceState: String,
  countryRegion: String,
  confirmedCases: Number,
  newCases: Number,
});
