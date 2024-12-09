import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
import path from 'path'

//load the proto file 
const userProto = protoLoader.loadSync(path.join(__dirname, "..", './test.proto'));
//pass the loaded proto to grpc
const {UserService}  = grpc.loadPackageDefinition(userProto);

const server = new grpc.Server();
const users:any[] = [];

//add all the func
//@ts-ignore
server.addService(UserService.service ,{
    addUser:(call:any, callback:any)=>{
      console.log(call);
      let person = {
        id: call.request.id || Math.floor(Math.random() * 1000),
        name: call.request.name,
        email: call.request.email
      }
      users.push(person);
      callback(null, person)
    },
    getUser:(call:any, callback:any)=>{
        console.log(call);
        const user = users.find(user => user.id === call.request.id);
        callback(null,user);
    }
} )

server.bindAsync(
    '0.0.0.0:50051',
    grpc.ServerCredentials.createInsecure(), 
    ()=>server.start()
)