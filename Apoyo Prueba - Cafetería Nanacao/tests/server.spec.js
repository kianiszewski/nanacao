const request = require("supertest");
const server = require("../index");

describe("Operaciones CRUD de cafés", () => {
  test("GET /cafes devuelve un status 200 y un arreglo con al menos un objeto", async () => {
    const response = await request(server).get("/cafes");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  test("DELETE /cafes/:id devuelve un status 404 si el café no existe", async () => {
    const nonExistentId = 999;
    const response = await request(server)
      .delete(`/cafes/${nonExistentId}`)
      .set("Authorization", "Bearer token_valido");
    expect(response.status).toBe(404);
    expect(response.body.message).toBe("No se encontró ningún cafe con ese id");
  });

  test("POST /cafes agrega un nuevo café y devuelve un código 201", async () => {
    const nuevoCafe = { id: 5, nombre: "Latte" };
    const response = await request(server)
      .post("/cafes")
      .send(nuevoCafe);
    expect(response.status).toBe(201);
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining(nuevoCafe)])
    );
  });

  test("PUT /cafes/:id devuelve un status 400 si el id del parámetro no coincide con el id del payload", async () => {
    const cafeInvalido = { id: 10, nombre: "Espresso" };
    const response = await request(server)
      .put("/cafes/1")
      .send(cafeInvalido);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe(
      "El id del parámetro no coincide con el id del café recibido"
    );
  });
});
