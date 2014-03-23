var testShortcuts = {
  title: "Default",

  shortcuts: [
    { "keys": ["super+shift+n"], "command": "new_window" },
    { "keys": ["super+shift+w"], "command": "close_window" },
    { "keys": ["super+o"], "command": "prompt_open" },
    { "keys": ["super+shift+t"], "command": "reopen_last_file" },
    { "keys": ["super+alt+up"], "command": "switch_file", "args": {"extensions": ["cpp", "cxx", "cc", "c", "hpp", "hxx", "h", "ipp", "inl", "m", "mm"]} },
    { "keys": ["super+n"], "command": "new_file" },
    { "keys": ["super+s"], "command": "save" },
    { "keys": ["super+shift+s"], "command": "prompt_save_as" },
    { "keys": ["super+alt+s"], "command": "save_all" },
    { "keys": ["super+w"], "command": "close" }]
}