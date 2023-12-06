def findPS_D(PS):
    maxPS = 0

    for i in range(1, len(PS)):
        i = i - 1 
        currPS = PS[i] - PS[i+1]
        
        if currPS > maxPS:
            maxPS = currPS 

    return maxPS

PS = [80,79,80,77,78]

print(findPS_D(PS))