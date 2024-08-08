exports.checkRole=async(role)=>{
    try{
if(role==='admin')
{
    return true
}
    }catch(err)
    {
console.log('Role in not specifeied for this task')
return false
    }
}