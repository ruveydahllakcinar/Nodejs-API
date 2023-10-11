const whiteList = ["http://localhost:5000"]

const corsOptions = (req, callback) => {
    let corsOptions;
    console.log(req.header("Origin"));
    if(whiteList.indexOf(req.header("Origin")) !== -1) {
        corsOptions ={origin: true}
    }else{

        corsOptions ={origin: false}
    }

    callback(null, corsOptions)
}

module.exports =corsOptions