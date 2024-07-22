const http = require("k6/http");
const { check, sleep } = require("k6");

//offcial link: https://k6.io/docs/using-k6/http-requests/

const url = "https://www.chiehchunlin.com/timeline";
const accessToken = "your_accessToken";
export const options = {
  discardResponseBodies: true,
  insecureSkipTLSVerify: true,
  scenarios: {
    contacts: {
      executor: "constant-arrival-rate",
      rate: 250,
      timeUnit: "1s",
      duration: "20s",
      preAllocatedVUs: 500,
      maxVUs: 1000,
    }
  }
};
const payload = JSON.stringify({
  message: "k6_auth.js test"
});
const params = {
  headers: {
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json"
  }
};
// test HTTP
export default function () {
  const res = http.post(url, payload, params);
  check(res, { "status was 200": (r) => r.status == 200 });
  sleep(1);
}