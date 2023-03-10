import { readDataStation, upload } from "./helper";
import multer from "multer";
import { Request, Response } from "express";
import path from "path";
import { isProd } from "../utility/utility";
import {
  getAddressOfStation,
  getDetailEndingAtTheStation,
  getDetailStartingFromTheStation,
  getStationByName,
  getStationList,
  getTop5Depart,
  getTop5Return,
  getTotalStation,
  insertStationToDb,
} from "../models/station";

// Station array data

const uploadStation = (req: Request, res: Response) => {
  const validStationArr: any[] = [];
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    }

    try {
      if (req.file) {
        const pathOfFile = isProd()
          ? req.file?.path
          : path.join(__dirname, `../../${req.file?.path}`);

        // validate data
        const validateStation = await readDataStation(
          pathOfFile,
          validStationArr
        );
        if (validateStation) {
          console.log("Sucessfully validate station data");

          // Insert read data to database
          const insertStation = await insertStationToDb(validStationArr);

          if (insertStation) {
            console.log("Sucessfully inserting station data");

            res.status(200).send({ message: "Sucessfully!" });
          }
        }
      } else {
        console.log(new Error("Missing file in request"));
      }
    } catch (err) {
      console.log("Upload file station failed: ", err);
      res.status(400).send("Imported data has been failed");
    }
  });
};

const searchStationByName = async (req: Request, res: Response) => {
  if (!req.query.searchKey) {
    res.status(400).send("Missing SearchKeyword in query");
    return;
  }

  const params = req.query.searchKey as string;

  try {
    const result = await getStationByName(params);
    res.json(result);
  } catch (err) {
    console.error("Search station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getStation = async (req: Request, res: Response) => {
  const params = req.query.page ? ([req.query.page] as string[]) : ["1"];

  try {
    const result = await getStationList(params);
    res.json(result);
  } catch (err) {
    console.error("get Station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTotalRowsOfStation = async (req: Request, res: Response) => {
  try {
    const result = await getTotalStation();
    res.json(result);
  } catch (err) {
    console.error("get Total Rows Of Journey data failed: ", err);
  }
};

const getTop5DepartStationEndingAtStation = async (
  req: Request,
  res: Response
) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
    return;
  }
  params = req.query.station as string;

  try {
    const result = await getTop5Depart(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 departure station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getTop5ReturnStationStartFromStation = async (
  req: Request,
  res: Response
) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
    return;
  }
  params = req.query.station as string;

  try {
    const result = await getTop5Return(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getDetailOfDepartStation = async (req: Request, res: Response) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
    return;
  }
  params = req.query.station as string;

  try {
    const result = await getDetailStartingFromTheStation(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getDetailOfReturnStation = async (req: Request, res: Response) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
    return;
  }
  params = req.query.station as string;

  try {
    const result = await getDetailEndingAtTheStation(params);
    res.json(result);
  } catch (err) {
    console.error("get Top 5 return station data failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

const getAddressStation = async (req: Request, res: Response) => {
  let params: string;

  if (!req.query.station) {
    res.status(400).send("Missing station in query");
    return;
  }
  params = req.query.station as string;

  try {
    const result = await getAddressOfStation(params);
    res.json(result);
  } catch (err) {
    console.error("get Address station failed: ", err);
    res.status(400).send("Bad Request!");
  }
};

export {
  getAddressStation,
  getDetailOfReturnStation,
  getDetailOfDepartStation,
  searchStationByName,
  uploadStation,
  getStation,
  getTotalRowsOfStation,
  getTop5ReturnStationStartFromStation,
  getTop5DepartStationEndingAtStation,
};
