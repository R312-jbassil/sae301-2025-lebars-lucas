/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_622462475")

  // update collection data
  unmarshal({
    "createRule": "",
    "deleteRule": "",
    "listRule": "",
    "updateRule": "",
    "viewRule": ""
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_622462475")

  // update collection data
  unmarshal({
    "createRule": "@request.auth.id != \"\"",
    "deleteRule": "id_utilisateur = @request.auth.id",
    "listRule": "id_utilisateur = @request.auth.id",
    "updateRule": "id_utilisateur = @request.auth.id",
    "viewRule": "id_utilisateur = @request.auth.id"
  }, collection)

  return app.save(collection)
})
