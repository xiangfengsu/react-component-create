export default {
  entry: ["src/index.js"],
  cjs: {
    type: "babel"
  },
  esm:{
    type: "babel"
  },
  umd:{
    name:'my-test-com',
    globals:{
      React:'react'
    }
  }
};
