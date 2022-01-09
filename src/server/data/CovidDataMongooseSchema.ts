import {Schema} from "mongoose";

export const CovidDataMongooseSchema = new Schema({
  date: String,
  provinceState: String,
  countryRegion: String,
  confirmed: Number,
});
