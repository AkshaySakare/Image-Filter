import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());
  var urlExists = require('url-exists');
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user

app.get("/filteredimage", async (req, res) => {
   let { image_url } = req.query;
  //console.log(image_url)

  // Error if url is not given
  if (!image_url) {
    res.status(400).send("URL not passed as parameter")
  }
  else {
    urlExists(image_url, function(err: any, out: any) {
      if(!out){
      res.status(400).send("URL not found")
    }
    });
      
    try {
      let image_response = await filterImageFromURL( image_url )
      if (image_response==="error"){
        res.status(415).send('URL is not an Image');
    }else{
    //sucess if image is present 
      res.status(200).sendFile(image_response, async () =>{
      await deleteLocalFiles([image_response])
      })
    }
  }catch{
    res.status(415).send('URL is not an Image');
  }
}
  
});

app.get( "/", async ( req, res ) => {
  res.send("try GET /filteredimage?image_url={{}}")
} );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
