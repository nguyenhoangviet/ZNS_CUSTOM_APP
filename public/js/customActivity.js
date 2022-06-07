define([
    'postmonger'
], function (
    Postmonger
) {
    'use strict';

    var connection = new Postmonger.Session();
    var authTokens = {};
    var payload = {};
    $(window).ready(onRender);

    connection.on('initActivity', initialize);
    connection.on('requestedTokens', onGetTokens);
    connection.on('requestedEndpoints', onGetEndpoints);
    connection.on('requestedInteraction', onRequestedInteraction);
    connection.on('requestedTriggerEventDefinition', onRequestedTriggerEventDefinition);
    connection.on('requestedDataSources', onRequestedDataSources);

    connection.on('clickedNext', save);
   
    function onRender() {
        // JB will respond the first time 'ready' is called with 'initActivity'
        connection.trigger('ready');

        connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
        connection.trigger('requestInteraction');
        connection.trigger('requestTriggerEventDefinition');
        connection.trigger('requestDataSources');  

    }

    function onRequestedDataSources(dataSources){
        console.log('*** requestedDataSources ***');
        console.log(dataSources);
    }

    function onRequestedInteraction (interaction) {    
        console.log('*** requestedInteraction ***');
        console.log(interaction);
     }

     function onRequestedTriggerEventDefinition(eventDefinitionModel) {
        console.log('*** requestedTriggerEventDefinition ***');
        console.log(eventDefinitionModel);
    }

    function initialize(data) {
        console.log(data);
        if (data) {
            payload = data;
        }
        
        var hasInArguments = Boolean(
            payload['arguments'] &&
            payload['arguments'].execute &&
            payload['arguments'].execute.inArguments &&
            payload['arguments'].execute.inArguments.length > 0
        );

        var inArguments = hasInArguments ? payload['arguments'].execute.inArguments : {};

        // console.log("inArgumentssaa");

        // $.each(inArguments, function (index, inArgument) {
        //     $.each(inArgument, function (key, val) {
                
              
        //     });
        // });

        $.each(inArguments, function (index, inArgument) {
            $.each(inArgument, function (key, val) {
                if (key === 'message') {
                    $("#message").html(val);
                } 
              
    
            });
            $("#message").val(inArgument.message);
            $('#pre-subtitle').html(inArgument.message);
            $("#url").val(inArgument.url);
            $("#preview-url").attr("href", inArgument.url);
            $("#urlimg").val(inArgument.urlimg);
            $('#pre-urlimg').attr('src',inArgument.urlimg);
            $("#title").val(inArgument.title);
            $("#pre-title").html(inArgument.title);

        });

        connection.trigger('updateButton', {
            button: 'next',
            text: 'done',
            visible: true
        });
    }

    function onGetTokens(tokens) {
        console.log(tokens);
        authTokens = tokens;
    }

    function onGetEndpoints(endpoints) {
        console.log(endpoints);
    }

    function save() {
        // var postcardURLValue = $('#postcard-url').val();
        // var postcardTextValue = $('#postcard-text').val();

        var message = $("#message").val();
        var url = $("#url").val();
        var urlimg = $("#urlimg").val();
        var title = $("#title").val();

        payload['arguments'].execute.inArguments = [{
  // "VersionNumber": "{{Context.VersionNumber}}" ,
            "message": message ,
            "url": url ,
            "title": title ,
            "urlimg": urlimg ,
            "ContactID": "{{Contact.Key}}" ,
            "name": " {{Contact.Attribute.Zalo_DE.Name}}",
            "ContactID": "{{Contact.Key}}" 
        }];
        
        payload['metaData'].isConfigured = true;

        console.log(payload);
        connection.trigger('updateActivity', payload);
    }


});
