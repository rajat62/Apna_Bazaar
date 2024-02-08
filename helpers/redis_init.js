import redis from 'redis';
const client = redis.createClient({
    port: 6379,
    host: 'ecommerce-redis' 
});

client.connect().then(()=>{
    console.log('Connected to Redis');
})
client.on('ready', ()=>{
    console.log("client connected to reddis and ready to use");
})

client.on('error', (err)=>{
    console.log(err.message);
})

client.on('end', ()=>{
    console.log("Client disconnected from redis");
})

process.on("exit", ()=>{
    client.quit();
})

// module.exports = client;
export default client;