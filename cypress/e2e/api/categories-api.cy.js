/// <reference types="cypress" />

// ============================================================
// TEST AUTOMATION API - Fake Store Platzi (/categories)
// Catatan: API asli (fakeapi.platzi.com / api.escuelajs.co) sedang
// tidak bisa diakses, sehingga seluruh request di-mock menggunakan
// cy.intercept() berdasarkan data referensi dari mentor
// (cypress/fixtures/categories.json). Setiap test tetap melakukan
// request sungguhan lewat browser (fetch), hanya jawabannya yang
// di-stub, sehingga status code & response body tetap bisa diuji.
// ============================================================

const API_URL = "https://api.escuelajs.co/api/v1/categories";

describe("API Testing - Categories (Fake Store Platzi, mocked)", () => {
  beforeEach(() => {
    // Visit halaman apa saja yang bisa diakses, hanya untuk
    // mendapatkan konteks browser tempat fetch() dijalankan.
    cy.visit("/web/index.php/auth/login");
  });

  // Helper: lakukan fetch ke API_URL dari dalam browser,
  // hasilnya dikembalikan sebagai { status, body }
  const callApi = (url = API_URL, options = {}) => {
    return cy.window().then((win) => {
      return win
        .fetch(url, options)
        .then((res) => res.json().then((body) => ({ status: res.status, body })));
    });
  };

  it("TC-API-01 - GET semua kategori mengembalikan status 200", () => {
    cy.intercept("GET", API_URL, { fixture: "categories.json" }).as("getAll");
    callApi().then((res) => {
      expect(res.status).to.eq(200);
    });
  });

  it("TC-API-02 - GET semua kategori mengembalikan array dengan 20 item", () => {
    cy.intercept("GET", API_URL, { fixture: "categories.json" }).as("getAll");
    callApi().then((res) => {
      expect(res.body).to.be.an("array");
      expect(res.body).to.have.length(20);
    });
  });

  it("TC-API-03 - Item pertama memiliki name 'Clothes Updated'", () => {
    cy.intercept("GET", API_URL, { fixture: "categories.json" }).as("getAll");
    callApi().then((res) => {
      expect(res.body[0]).to.have.property("name", "Clothes Updated");
    });
  });

  it("TC-API-04 - Setiap item memiliki properti wajib (id, name, slug, image)", () => {
    cy.intercept("GET", API_URL, { fixture: "categories.json" }).as("getAll");
    callApi().then((res) => {
      res.body.forEach((item) => {
        expect(item).to.have.all.keys(
          "id",
          "name",
          "slug",
          "image",
          "creationAt",
          "updatedAt"
        );
      });
    });
  });

  it("TC-API-05 - Kategori dengan id 2 memiliki name 'electronic'", () => {
    cy.intercept("GET", API_URL, { fixture: "categories.json" }).as("getAll");
    callApi().then((res) => {
      const item = res.body.find((c) => c.id === 2);
      expect(item).to.exist;
      expect(item.name).to.eq("electronic");
    });
  });

  it("TC-API-06 - GET detail kategori id=1 mengembalikan status 200 dan data yang sesuai", () => {
    cy.intercept("GET", `${API_URL}/1`, {
      statusCode: 200,
      body: { id: 1, name: "Clothes Updated", slug: "clothes-updated" },
    }).as("getById");
    callApi(`${API_URL}/1`).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.id).to.eq(1);
      expect(res.body.name).to.eq("Clothes Updated");
    });
  });

  it("TC-API-07 - GET detail kategori dengan id tidak ditemukan mengembalikan status 404", () => {
    cy.intercept("GET", `${API_URL}/9999`, {
      statusCode: 404,
      body: { message: "Category not found", statusCode: 404 },
    }).as("getNotFound");
    callApi(`${API_URL}/9999`).then((res) => {
      expect(res.status).to.eq(404);
      expect(res.body.message).to.eq("Category not found");
    });
  });

  it("TC-API-08 - GET kategori dengan query limit=5 mengembalikan 5 item", () => {
    cy.fixture("categories.json").then((all) => {
      const limited = all.slice(0, 5);
      cy.intercept("GET", `${API_URL}?limit=5`, {
        statusCode: 200,
        body: limited,
      }).as("getLimited");
      callApi(`${API_URL}?limit=5`).then((res) => {
        expect(res.status).to.eq(200);
        expect(res.body).to.have.length(5);
      });
    });
  });

  it("TC-API-09 - POST membuat kategori baru mengembalikan status 201 dan data tersimpan", () => {
    const newCategory = { name: "Kategori Baru QA", image: "https://placehold.co/600x400" };
    cy.intercept("POST", API_URL, {
      statusCode: 201,
      body: { id: 999, ...newCategory, slug: "kategori-baru-qa" },
    }).as("createCategory");
    callApi(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newCategory),
    }).then((res) => {
      expect(res.status).to.eq(201);
      expect(res.body.name).to.eq("Kategori Baru QA");
      expect(res.body).to.have.property("id");
    });
  });

  it("TC-API-10 - PUT mengubah kategori id=4 mengembalikan status 200 dan name terbaru", () => {
    cy.intercept("PUT", `${API_URL}/4`, {
      statusCode: 200,
      body: { id: 4, name: "Shoes Updated", slug: "shoes" },
    }).as("updateCategory");
    callApi(`${API_URL}/4`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "Shoes Updated" }),
    }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body.name).to.eq("Shoes Updated");
    });
  });

  it("TC-API-11 - DELETE kategori id=5 mengembalikan status 200 dan body true", () => {
    cy.intercept("DELETE", `${API_URL}/5`, {
      statusCode: 200,
      body: true,
    }).as("deleteCategory");
    callApi(`${API_URL}/5`, { method: "DELETE" }).then((res) => {
      expect(res.status).to.eq(200);
      expect(res.body).to.eq(true);
    });
  });

  it("TC-API-12 - GET semua kategori saat server error mengembalikan status 500", () => {
    cy.intercept("GET", API_URL, {
      statusCode: 500,
      body: { message: "Internal Server Error" },
    }).as("getServerError");
    callApi().then((res) => {
      expect(res.status).to.eq(500);
      expect(res.body.message).to.eq("Internal Server Error");
    });
  });
});