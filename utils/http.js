const axios = require("axios");
const { API_ENDPOINT } = require("../config");

console.log("api endpoint: ", API_ENDPOINT);

const headers = {
  Accept: "application/json",
  "X-Requested-With": "XMLHttpRequest",
  Authorization:
    "Token eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjMsImlzcyI6Imh0dHA6XC9cLzE2Ny43MS4yMDIuNTJcL2FwaVwvdXNlcnNcL2xvZ2luIiwiaWF0IjoxNTcwNTE2NTAyLCJleHAiOjE1NzU3MDA1MDIsIm5iZiI6MTU3MDUxNjUwMiwianRpIjoiWUF1aURSUm8zazNTNHVKOSJ9.NQaocE1-X24L3af0M-ARXTF1LcC14Ke_tB1OhSRktP0"
};

const instance = axios.create({
  baseURL: API_ENDPOINT,
  headers,
  validateStatus: function(status) {
    return status < 500;
  }
});

module.exports = instance;
