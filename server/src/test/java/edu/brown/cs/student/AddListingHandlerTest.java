package edu.brown.cs.student;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import edu.brown.cs.student.main.server.handlers.AddListingHandler;
import edu.brown.cs.student.main.server.storage.MockStorage;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import okio.Buffer;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import spark.Spark;

public class AddListingHandlerTest {

  private static MockStorage mockStorage;

  private AddListingHandler addListingHandler;

  @BeforeAll
  public static void setup_before_everything() {
    mockStorage = new MockStorage();
    Spark.port(0);
  }

  private static HttpURLConnection tryRequest(String apiCall) throws IOException {
    URL requestURL = new URL("http://localhost:" + Spark.port() + "/" + apiCall);
    HttpURLConnection clientConnection = (HttpURLConnection) requestURL.openConnection();
    clientConnection.setRequestMethod("POST");
    clientConnection.connect();
    return clientConnection;
  }

  @BeforeEach
  public void setup() {
    addListingHandler = new AddListingHandler(mockStorage);
    Spark.post("/addlisting", addListingHandler);
    Spark.init();
    Spark.awaitInitialization();
  }

  @AfterEach
  public void teardown() {
    Spark.unmap("/addlisting");
    Spark.stop();
    Spark.awaitStop();
  }

  @Test
  public void testAddListingValid() throws IOException {
    String validListingData =
        "add-listing?seller_id=1&title=Book&available=true&description=Great+book"
            + "&price=15.0&category=Books&condition=New&image_url=book.jpg&tags=fiction,thriller";
    HttpURLConnection clientConnection = tryRequest(validListingData);
    assertEquals(200, clientConnection.getResponseCode());

    Buffer buffer = new Buffer();
    String response = buffer.readFrom(clientConnection.getInputStream()).toString();

    // i forgot how this works - do we need to add a success or failure response??
    assertEquals("Success", response);
    clientConnection.disconnect();

    // idk if this works
    assertTrue(mockStorage.contains("Book"));
  }

  @Test
  public void testAddListingMissingParameters() throws IOException {
    String invalidListingData = "add-listing?seller_id=1&title=Book&available=true&price=15.0";
    HttpURLConnection clientConnection = tryRequest(invalidListingData);
    assertEquals(400, clientConnection.getResponseCode());

    Buffer buffer = new Buffer();
    String response = buffer.readFrom(clientConnection.getInputStream()).toString();

    assertEquals("Failure", response);
    clientConnection.disconnect();
  }

  @Test
  public void testAddListingInvalidData() throws IOException {
    String invalidListingData =
        "add-listing?seller_id=1&title=Book&available=true&description=Great+book"
            + "&price=invalidPrice&category=Books&condition=New&image_url=book.jpg&tags=fiction,thriller";
    HttpURLConnection clientConnection = tryRequest(invalidListingData);
    assertEquals(400, clientConnection.getResponseCode());

    Buffer buffer = new Buffer();
    String response = buffer.readFrom(clientConnection.getInputStream()).toString();

    assertEquals("Failure", response);
    clientConnection.disconnect();
  }

  @Test
  public void testAddListingDuplicateTitle() throws IOException {
    String validListingData =
        "add-listing?seller_id=1&title=Book&available=true&description=Great+book"
            + "&price=15.0&category=Books&condition=New&image_url=book.jpg&tags=fiction,thriller";
    HttpURLConnection clientConnection = tryRequest(validListingData);
    assertEquals(200, clientConnection.getResponseCode());

    clientConnection = tryRequest(validListingData);
    assertEquals(400, clientConnection.getResponseCode());

    Buffer buffer = new Buffer();
    String response = buffer.readFrom(clientConnection.getInputStream()).toString();

    assertEquals("Failure", response);
    clientConnection.disconnect();
  }
}
