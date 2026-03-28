public function up()
{
    Schema::create('messages', function (Blueprint $table) {
        $table->id();
        $table->unsignedBigInteger('sender_id');
        $table->unsignedBigInteger('receiver_id');
        $table->unsignedBigInteger('post_id');
        $table->text('content');
        $table->timestamps();
    });
}