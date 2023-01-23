import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { URL } from "../../utility";

type StationParams = {
  nameOfStation: string;
};

const fetchSpecificData = async (endpoint: string, stationName: string) => {
  const response = await fetch(`${URL}/${endpoint}?station=${stationName}`);

  const json = await response.json();

  return json;
};

const SingleStation = () => {
  const { nameOfStation } = useParams<StationParams>();
  const [detail, setDetail] = useState({
    name: "",
    address: "",
    numberOfJourneyStartFrom: 0,
    numberOfJourneyEndingAt: 0,
    distanceOfJouneyStartFromStation: 0,
    distanceOfJouneyEndAtStation: 0,
    top5Depart: [] as any[],
    top5Return: [] as any[],
  });

  const fetchDetailStation = async (stationName = "") => {
    try {
      const address = await fetchSpecificData("getAddressStation", stationName);
      const addressString = `${address.Adress}, ${address.Kaupunki} `;

      const startFromStation = await fetchSpecificData(
        "getDetailOfDepartStation",
        stationName
      );

      const endAtStation = await fetchSpecificData(
        "getDetailOfReturnStation",
        stationName
      );

      const top5DepatureStationFromStation = await fetchSpecificData(
        "getTop5DepartStationEndingAtStation",
        stationName
      );

      const top5Depart = [...top5DepatureStationFromStation].map(
        (el) => el.departure_station_name
      );
      const top5ReturnStationFromStation = await fetchSpecificData(
        "getTop5ReturnStationStartFromStation",
        stationName
      );

      const top5Return = [...top5ReturnStationFromStation].map(
        (el) => el.return_station_name
      );

      setDetail({
        name: stationName,
        address: addressString,
        numberOfJourneyStartFrom: startFromStation[0].count,
        numberOfJourneyEndingAt: endAtStation[0].count,
        distanceOfJouneyStartFromStation: startFromStation[0].total_distance,
        distanceOfJouneyEndAtStation: endAtStation[0].total_distance,
        top5Depart: top5Depart,
        top5Return: top5Return,
      });
    } catch (err) {
      throw new Error("Fetching detail of station failed: " + err);
    }
  };

  useEffect(() => {
    if (nameOfStation) {
      fetchDetailStation(nameOfStation);
    }
  }, [nameOfStation]);

  return (
    <div>
      <h1>{nameOfStation}</h1>
      <ul>
        <li>Name of station: {nameOfStation}</li>
        <li>Address : {detail.address}</li>
        <li>
          Total number of journeys starting from the station :{" "}
          {detail.numberOfJourneyStartFrom}
        </li>
        <li>
          Total number of journeys ending at the station :{" "}
          {detail.numberOfJourneyEndingAt}
        </li>
        <li>
          The average distance of a journey starting from the station :{" "}
          {detail.distanceOfJouneyStartFromStation / 1000} km
        </li>
        <li>
          The average distance of a journey ending at the station :{" "}
          {detail.distanceOfJouneyEndAtStation / 1000} km
        </li>
        <li>
          Top 5 most popular departure stations for journeys ending at the
          station
          <ul>
            {detail.top5Depart.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
        <li>
          Top 5 most popular return stations for journeys starting from the
          station
          <ul>
            {detail.top5Return.map((name) => (
              <li key={name}>{name}</li>
            ))}
          </ul>
        </li>
      </ul>
    </div>
  );
};

export default SingleStation;