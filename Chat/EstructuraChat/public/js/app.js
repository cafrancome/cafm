//-----FUNCIONES DEL DISEÑO ADAPTATIVO------//
function isMobile(){
  var screenSize = screen.width;
  if(screenSize<992){
    return true
  }else return false;
}

function inicioOrganizacion(){
  if (isMobile()==true) {
    $('#btnMessage').attr('class', 'btn-floating hide-on-large-only')
    organizarMensaje();
  }
}

function organizarMensaje(){
  $(".numHora").unwrap();
  var horas = $(".numHora");
  for (var i = 0; i < horas.length; i++) {
    $(horas[i]).prependTo($(horas[i]).prev());
  }
  var horasRecibido=$(".recibidos .numHora");
  for (var i = 0; i < horasRecibido.length; i++) {
    $(horasRecibido[i]).next().after(horasRecibido[i]);
  }

}

function slideContactos(direction){
  if (desplegado==false) {
    if (direction=="left") {
      $(".right-side")
      .css({
        position: "absolute",
        zIndex: "3",
        right: "0px",
        display: "none"
      })
      .removeClass("hide-on-small-only")
      .show("slide", { direction: "right" },300)
      desplegado=true;
    }

  }else{
    if (direction=="right") {
      $(".right-side").hide("slide", { direction: "right" }, 300)

      desplegado=false;
    }


  }
}
var desplegado = false;

$(function(){
  //----VARIABLES Y FUNCIONES DEL DISEÑO ADAPTATIVO -----//
  $(".container").css("height",$(window).height());
  inicioOrganizacion();
  if (isMobile()) {
    $(".input-contenedor button").html("<i class='material-icons right'>send</i>")
    $("body").swipe({
      swipe:function(event, direction, distance, duration, fingerCount){
        slideContactos(direction);
      },
      allowPageScroll:"vertical"
    })
    $(".titulo-chat button").on("click", function(){
      slideContactos("left");
    })
  }
})

(function (document, window, undefined, $, io) {
  (function () {
      return Chat = {
          //Todo el codifo va aqui
          apiUrl: '/chat',
          $userDataModel: $('#modalCaptura'),
          $btnMessage: $('#btnMessage'),
          $messageText: $('#messageText'),
          userName: '',
          socket: io(),

          //Constructor
          Init: function () {
              var self = this; //Para mantener y obtener el contexto de js
              this.fetchUserInfo(function (user) {
                  self.renderUser(user);
              })
              this.watchMessages()
              self.socket.on('userJoin', function(user){
                  self.renderUser(user)
              })
              self.socket.on('message', function(message){
                  self.renderUser(message)
              })
          },

          fetchUserInfo: function (callBack) {
              var self = this;
              this.$userDataModel.openModal();
              var $GuardarInfo = $('.guardaInfo')
              $GuardarInfo.on('click', function () {
                  var nombre = $('.nombreUsuario').val()
                  var user = [{
                      nombre: nombre,
                      img: 'p2.png'
                  }]
                  self.socket.emit('userJoin', user[0])
                  callBack(user)

                  self.joinUser(user[0])


                  self.userName = nombre
                  self.$userDataModel.closeModal()
              });
              self.getInitialUsers()
          },

          getInitialUsers: function () {
              var self = this;
              var endpoint = self.apiUrl + '/users'
              self.ajaxRequest(endpoint, 'GET', {})
                  .done(function (data) {
                      var users = data.current
                      self.renderUser(users)
                  }).fail(function (error) {
                      console.log(error);
                  })
          },

          ajaxRequest: function (url, type, data) {
              return $.ajax({
                  url: url,
                  type: type,
                  data: data
              })
          },

          joinUser: function (user) {
              var self = this;
              var endpoint = self.apiUrl + '/users'
              var userobj = {
                  user: user
              }
              self.ajaxRequest(endpoint, 'POST', userobj)
                  .done(function (response) {
                      console.log(response)
                  }).fail(function (error) {
                      alert(error);
                  })
          },

          renderUser: function (users) {
              var self = this;
              var userList = $('.users-list')
              var userTemplate = '<li class="collection-item avatar">' +
                  '<img src="image/:image:" class="circle">' +
                  '<span class="title">:nombre:</span>' +
                  '<p><img src="image/online.png"/>En linea </p>' +
                  '</li>'
              users.map(function (user) {
                  var newUsers = userTemplate.replace(':image:', 'p2.jpg')
                      .replace(':nombre:', users.nombre)
              })
          },

          watchMessages: function () {
              var self = this
              self.$messageText.on('keypress', function (e) {
                  if (e.which == 13) {
                      if ($(this).val().tirm() != '') {
                          var message = {
                              sender: self.userName,
                              text: $(this).val()
                          }
                          self.renderMessage(message)
                          self.socket.emit('message', message)
                          $(this).val('')
                      } else {
                          e.preventDefault()
                      }
                  }
              })
              self.$btnMessage.on('click', function () {
                  if (self.$btnMessage.val() != '') {
                      var message = {
                          sender: self.userName,
                          text: $(this).val()
                      }
                      self.renderMessage(message)
                      self.socket.emit('message', message)
                      self.$messageText.val('')
                  }
              })
          },

          renderMessage: function (message) {
              var self = this
              var tipoMensaje = message.sender == self.userName ? 'recibidos' : 'enviado'
              var messageList = $('.historial-chat')
              var messageTemplate = '<div class=":tipoMensaje:">' +
                  '<div class="mensaje">' +
                  '<div class="imagen">' +
                  '<img src="image/p2.jpg" alt="Contacto"/>' +
                  '</div>' +
                  '<div class="texto">' +
                  '<span class="nombre">:nombre:</span><br>' +
                  '<span>:mensaje:</span>' +
                  '</div>' +
                  '<div class="hora">' +
                  '<span class="numHora">:hora:</span>' +
                  '</div>' +
                  '</div>' +
                  '</div>';
              var currentDate = new Date();
              var newMenssage = messageTemplate.replace(':tipoMensaje:', tipoMensaje)
                  .replace(':nombre:', message.sender)
                  .replace(':mensaje:', message.text)
                  .replace(':hora:', currentDate.getHours() + ':' + currentDate.getMinutes())
              messageList.append(newMenssage)
              $(".srcoller-chat").animate({
                  scrollTop: $(".scroller-chat").get(0).scrollHeight
              }, 500)


          }


      }
  })();

  Chat.Init();
  
})(document, window, undefined, jQuery, io);
