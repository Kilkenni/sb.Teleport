/*
The *chat* table is present only in OpenStarbound!
*/

declare module chat {
  //SOURCE: frontend/StarInterfaceLuaBindings.cpp

  // function send():void

/*


LuaCallbacks LuaBindings::makeChatCallbacks(MainInterface* mainInterface, UniverseClient* client) {
  LuaCallbacks callbacks;

  auto chat = as<Chat>(mainInterface->paneManager()->registeredPane(MainInterfacePanes::Chat).get());

  callbacks.registerCallback("send", [chat, client](String const& message, Maybe<String> modeName, Maybe<bool> speak) {
    auto sendMode = modeName ? ChatSendModeNames.getLeft(*modeName) : ChatSendMode::Broadcast;
    client->sendChat(message, sendMode, speak);
  });

  // just for SE compat - this shoulda been a utility callback :moyai:
  callbacks.registerCallback("parseArguments", [](String const& args) -> LuaVariadic<Json> {
    return Json::parseSequence(args).toArray();
  });

  callbacks.registerCallback("command", [mainInterface](String const& command) -> StringList {
    return mainInterface->commandProcessor()->handleCommand(command);
  });

  callbacks.registerCallback("addMessage", [client, chat](String const& text, Maybe<Json> config) {
    ChatReceivedMessage message({MessageContext::Mode::CommandResult, ""}, client->clientContext()->connectionId(), "", text);
    if (config) {
      if (auto mode = config->optString("mode"))
        message.context.mode = MessageContextModeNames.getLeft(*mode);
      if (auto channelName = config->optString("channelName"))
        message.context.channelName = std::move(*channelName);
      if (auto portrait = config->optString("portrait"))
        message.portrait = std::move(*portrait);
      if (auto fromNick = config->optString("fromNick"))
        message.fromNick = std::move(*fromNick);
    }
    chat->addMessages({std::move(message)}, config ? config->getBool("showPane", true) : true);
  });

  callbacks.registerCallback("input", [chat]() -> String {
    return chat->currentChat();
  });

  callbacks.registerCallback("setInput", [chat](String const& text, Maybe<bool> moveCursor) -> bool {
    return chat->setCurrentChat(text, moveCursor.value(false));
  });

  callbacks.registerCallback("clear", [chat](Maybe<size_t> count) {
    chat->clear(count.value(std::numeric_limits<size_t>::max()));
  });

  return callbacks;
}

*/

}