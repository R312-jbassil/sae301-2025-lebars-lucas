/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = new Collection({
    "createRule": null,
    "deleteRule": null,
    "fields": [
      {
        "autogeneratePattern": "[a-z0-9]{15}",
        "hidden": false,
        "id": "text3208210256",
        "max": 15,
        "min": 15,
        "name": "id",
        "pattern": "^[a-z0-9]+$",
        "presentable": false,
        "primaryKey": true,
        "required": true,
        "system": true,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "_pb_users_auth_",
        "hidden": false,
        "id": "relation84848196",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_utilisateur",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "relation"
      },
      {
        "convertURLs": false,
        "hidden": false,
        "id": "editor1885562883",
        "maxSize": 0,
        "name": "code_svg_final",
        "presentable": false,
        "required": true,
        "system": false,
        "type": "editor"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text700194633",
        "max": 0,
        "min": 0,
        "name": "nom_configuration",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "hidden": false,
        "id": "bool3985046722",
        "name": "genere_par_ia",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "bool"
      },
      {
        "autogeneratePattern": "",
        "hidden": false,
        "id": "text3316539063",
        "max": 0,
        "min": 0,
        "name": "prompt_ia",
        "pattern": "",
        "presentable": false,
        "primaryKey": false,
        "required": false,
        "system": false,
        "type": "text"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1486587212",
        "hidden": false,
        "id": "relation3766893659",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_monture",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1486587212",
        "hidden": false,
        "id": "relation3170130116",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_branche",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_1486587212",
        "hidden": false,
        "id": "relation627676910",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_verre",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2930779908",
        "hidden": false,
        "id": "relation784735379",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_pont",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "cascadeDelete": false,
        "collectionId": "pbc_2930779908",
        "hidden": false,
        "id": "relation3615183155",
        "maxSelect": 1,
        "minSelect": 0,
        "name": "id_taille_verre",
        "presentable": false,
        "required": false,
        "system": false,
        "type": "relation"
      },
      {
        "hidden": false,
        "id": "autodate2990389176",
        "name": "created",
        "onCreate": true,
        "onUpdate": false,
        "presentable": false,
        "system": false,
        "type": "autodate"
      },
      {
        "hidden": false,
        "id": "autodate3332085495",
        "name": "updated",
        "onCreate": true,
        "onUpdate": true,
        "presentable": false,
        "system": false,
        "type": "autodate"
      }
    ],
    "id": "pbc_622462475",
    "indexes": [],
    "listRule": null,
    "name": "lunette_sauvegardee",
    "system": false,
    "type": "base",
    "updateRule": null,
    "viewRule": null
  });

  return app.save(collection);
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_622462475");

  return app.delete(collection);
})
