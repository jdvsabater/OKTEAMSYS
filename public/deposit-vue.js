
(function(){
  var depositVue = new Vue({
    el: '#depositVue',
    data: {
      title: null,
      description: null,
      notes: []
    },
        created: function(){
            var self = this;
            axios.get('../index.js')
            .then(function(res){
                self.notes = res.data;
            })
            .catch(function(err){
                self.notes = [];
            });
        },
        methods: {
            addNote: function(){
            var self = this;
            var payload = {
                title: self.title,
                description: self.description
                
            };
            axios.post('/api/notes', payload)
                .then(function(res){
                    self.notes = res.data;
                    self.clear();
                // self.notes.push({ //array -data type- needs push
                // id:5,
                // title: self.title,
                // description:self.description
                // });
                })
            .catch(function(err){
            });
        },
        clear: function(){
            this.title = null;
            this.description = null;
        },
        deleteNote: function(note){
            var self = this;
                axios.delete('/api/notes/'+note.id)
                    .then(function(res){
                        var index = -1;
                        for(var i = 0; i < self.notes.length; i++){
                            if(Number(self.notes[i].id) === Number(note.id)){
                                index =i;
                                break;
                            }
                        }
                        self.notes.splice(index, 1);        
                    })
                .catch(function(err){
                });
        }
      }
    });
    console.log(depositVue);
})();   