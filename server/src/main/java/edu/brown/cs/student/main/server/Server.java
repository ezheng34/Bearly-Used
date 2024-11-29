package edu.brown.cs.student.main.server;

import static spark.Spark.after;

import edu.brown.cs.student.main.server.handlers.AddListingHandler;
import edu.brown.cs.student.main.server.storage.RealStorage;
import edu.brown.cs.student.main.server.storage.StorageInterface;
import spark.Filter;
import spark.Spark;

/** Top Level class for our project, utilizes spark to create and maintain our server. */
public class Server {

  /** Sets up server (endpoints, firebase) */
  public static void setUpServer() {
    int port = 3232;
    Spark.port(port);

    after(
        (Filter)
            (request, response) -> {
              response.header("Access-Control-Allow-Origin", "*");
              response.header("Access-Control-Allow-Methods", "*");
            });

    StorageInterface dbHandler;

    try {
      dbHandler = new RealStorage();
      Spark.get("add-listing", new AddListingHandler(dbHandler));

      Spark.notFound(
          (request, response) -> {
            response.status(404); // Not Found
            System.out.println("ERROR");
            return "404 Not Found - The requested endpoint does not exist.";
          });
      Spark.init();
      Spark.awaitInitialization();

    } catch (Exception e) {
      e.printStackTrace();
      System.err.println("Error starting server");
      System.exit(1);
    }
    //    try {
    //      JSONParser jsonParser = new JSONParser("data/geojson/fullDownload.geojson");
    //      GeoMapCollection geoMap = jsonParser.getData();
    //
    //      firebaseUtils = new FirebaseUtilities();
    //
    //      Spark.get("boundingbox", new BoundingHandler(geoMap));
    //      Spark.get("keyword", new KeywordHandler(geoMap));
    //      Spark.get("add-word", new AddWordHandler(firebaseUtils));
    //      Spark.get("list-words", new ListWordsHandler(firebaseUtils));
    //      Spark.get("clear-user", new ClearUserHandler(firebaseUtils));
    //      Spark.get("add-pin", new AddPinHandler(firebaseUtils));
    //      Spark.get("clear-pins", new ClearPinsHandler(firebaseUtils));
    //      Spark.get("list-pins", new ListPinsHandler(firebaseUtils));
    //
    //      Spark.notFound(
    //          (request, response) -> {
    //            response.status(404); // Not Found
    //            System.out.println("ERROR");
    //            return "404 Not Found - The requested endpoint does not exist.";
    //          });
    //      Spark.init();
    //      Spark.awaitInitialization();
    //
    //      System.out.println("Server started at http://localhost:" + port);
    //    } catch (IOException e) {
    //      e.printStackTrace();
    //      System.err.println(
    //          "Error: Could not initialize Firebase. Likely due to firebase_config.json not being
    // found. Exiting.");
    //      System.exit(1);
    //    }
  }

  /**
   * Runs Server.
   *
   * @param args none
   */
  public static void main(String[] args) {
    setUpServer();
  }
}
