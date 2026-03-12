
export enum EditorEvents {
  // === Editor stuff ===
  // ECS general management
  ED_ADD_ENTITY = 'ed_addentity',
  ED_ENTITY_CLICKED = 'ed_entityclicked',
  ED_UI_PROP_CHANGED = 'ed_ui_propchanged',
  ED_UI_DELETE_ENTITY = 'ed_ui_deleteentity',
  ED_PH_DELETE_ENTITY = 'ed_ph_deleteentity',
  ED_UI_REMOVE_COMPONENT = 'ed_ui_removecomponent',
  ED_PH_COMPONENT_REMOVED = 'ed_ph_componentremoved',
  // Entity placement
  ED_UI_START_PLACE_ENTITY = 'ed_ui_startplaceentity',
  ED_UI_START_MOVE_ENTITY = 'ed_ui_startmoveentity',
  ED_UI_ABORT_PLACE = 'ed_ui_abortplace',
  ED_PH_ABORT_PLACE = 'ed_ph_abortplace',
  // Fire shot
  ED_UI_START_FIRE_SHOT = 'ed_ui_startfireshot',
  ED_FIRE_SHOT_READY = 'ed_fireshotready',
  ED_UI_FIRE_SHOT_CONFIRM = 'ed_ui_fireshotconfirm',
  ED_UI_FIRE_SHOT_CANCEL = 'ed_ui_fireshotcancel',
  ED_FIRE_MODE_EXITED = 'ed_firemodeexited',
  // Editor options
  ED_UI_CLEAR_TRAILS = 'ed_ui_cleartrails',
  ED_UI_OPTIONS_DEATHSTAR_SIZE = 'ed_ui_options_deathstarsize',
  ED_UI_OPTIONS_ALL_DESTRUCTIBLE = 'ed_ui_options_alldestructible',
  ED_UI_OPTIONS_BACKGROUND = 'ed_ui_options_background',
  ED_ENTITY_HOVERED = 'ed_entityhovered',
  ED_UI_SAVE_SCENARIO = 'ed_ui_savescenario',
  ED_UI_LOAD_SCENARIO = 'ed_ui_loadscenario',
  ED_SCENARIO_LOADED = 'ed_scenarioloaded',
}
