const redis = require("redis");

const REDIS_COMMANDS = {
  get_all_keys: "Keys *",
  add_value_to_key: "Set cust:1000:sdt 090109012",
  get_value_by_key: "Get cust:1000:sdt",
};

module.exports = {
  createConnection: () => {
    return new Promise((resolve, reject) => {
      const client = redis.createClient();
      client.on("connect", () => {
        resolve(client);
      });

      client.on("error", () => {
        reject("Error: Failed to connect");
      });
    });
  },
};
