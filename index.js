const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", (req, res) => {
  const query = req.body.cityName;
  const apiKey = "6c50947c5a06dff1cbe20e13aa190942";
  const units = "metric";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${apiKey}&units=${units}`;

  https.get(url, (response) => {
    let rawData = "";

    response.on("data", (chunk) => {
      rawData += chunk;
    });

    response.on("end", () => {
      try {
        const wedaData = JSON.parse(rawData);

        const temp = wedaData.main.temp;
        const desc = wedaData.weather[0].description;
        const icon = wedaData.weather[0].icon;
        const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;

        res.send(`
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Weather Result</title>
              <style>
                body {
                  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                  background: linear-gradient(to right, #5e3c72, #2a5298);
                  color: white;
                  text-align: center;
                  padding: 50px;
                }
                .weather-box {
                  background: rgba(255, 255, 255, 0.1);
                  padding: 30px;
                  border-radius: 12px;
                  box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                  display: inline-block;
                  margin-top: 30px;
                }
                h1 {
                  font-size: 2.5rem;
                }
                p {
                  font-size: 1.2rem;
                }
                img {
                  margin-top: 20px;
                }
                a {
                  display: block;
                  width: fit-content;
                  margin: 0 auto;
                  text-align: center;
                  font-weight: bold;
                  background-color: #ffffff;
                  color: #1e3c72;
                  padding: 10px 20px;
                  border-radius: 5px;
                  margin-top: 30px;
                  text-decoration: none;
                  font-size: 0.9rem;
                }

                .temp {
                color: #3ad454;
                }

                .query {
                color: yellow ;
                }

                .desc {
                color: orange ;
                  font-weight: bold;
                }

              </style>
            </head>
            <body>
              <div class="weather-box">
                <h1>Temperature in <span class='query' >${query}</span> is <span class='temp' >${temp}</span>°C</h1>
                <p>Weather is currently <span class='desc' >${desc}</span></p>
                <img src="${imageURL}" alt="Weather Icon">
              </div>
              <a href="/">Check another city</a>
            </body>
          </html>
        `);
      } catch (e) {
        res.send(
          `<h2>Error fetching weather for "${query}". Please try again.</h2><a href="/">Go back</a>`
        );
      }
    });
  });
});

app.listen(9000, () => {
  console.log("Server is running on port 9000");
});
